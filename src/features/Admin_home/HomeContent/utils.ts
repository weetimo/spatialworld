import { ageGroups } from '../../../constants'

export const exportToCSV = (data: any[]) => {
  // Define headers for all fields
  const headers = [
    'ID',
    'Name',
    'Email',
    'Gender',
    'Age Group',
    'Postal Code'
  ]

  // Convert data to CSV format
  const csvContent = [
    // Add headers as first row
    headers.join(','),
    // Map data to rows
    ...data.map(row => [
      row.id,
      row.name,
      row.email,
      row.gender,
      row.ageGroup,
      row.postalCode
    ].join(','))
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'participants_data.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const demographicsData = (users: any[]) => {
  const result = ageGroups.map(ageGroup => ({
    age: ageGroup,
    male: 0,
    female: 0
  }))

  users.forEach(({ ageGroup, gender }) => {
    const demographic = result.find(item => item.age === ageGroup)

    if (gender === 'MALE') {
      demographic.male += 1
    } else if (gender === 'FEMALE') {
      demographic.female += 1
    }
  })

  return result
}

export const regionData = (users: any[]) => {
  const regions = [
    {
      region: "Central",
      postalCodes: [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13",
        "14", "15", "16", "17", "18", "19", "20", "21", "31", "32", "33", "34", "35",
        "36", "37", "56", "57"
      ],
      color: "#ef4444"
    },
    {
      region: "East",
      postalCodes: [
        "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
        "51", "52"
      ],
      color: "#fecdd3"
    },
    {
      region: "West",
      postalCodes: [
        "22", "23", "24", "25", "26", "27", "60", "61", "62", "63", "64", "65", "66",
        "67", "68", "69", "70", "71"
      ],
      color: "#f97316"
    },
    {
      region: "North",
      postalCodes: ["72", "73", "75", "76", "77", "78"],
      color: "#ffd7aa"
    },
    {
      region: "North-East",
      postalCodes: ["28", "29", "30", "53", "54", "55", "58", "59"],
      color: "#fef9c3"
    }
  ]

  const regionCounts = users.reduce((acc, user) => {
    const firstTwoDigits = user.postalCode.slice(0, 2)
    const region = regions.find(r => r.postalCodes.includes(firstTwoDigits))

    if (region) {
      acc[region.region] = (acc[region.region] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const totalUsers = users.length

  return regions.map(({ region, color }) => ({
    name: region,
    value: Number(((regionCounts[region] || 0) / totalUsers * 100).toFixed(2)),
    color
  }))
}

interface Generation {
  prompt: string;
}

// Updated interface to match ReactWordcloud expectations
interface WordCloudData {
  text: string;
  value: number;
}

export const word_cloud = (generations: Generation[]): WordCloudData[] => {
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'were', 'will', 'with', 'the', 'this', 'but', 'they',
    'have', 'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how'
  ]);

  const wordCount: { [key: string]: number } = {};

  generations.forEach(generation => {
    const words = generation.originalPrompt
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/);

    words.forEach(word => {
      if (word && !stopWords.has(word)) {
        if (wordCount[word] === undefined) {
          wordCount[word] = 1;
        } else {
          wordCount[word] += 1;
        }
      }
    });
  });

  // Transform to ReactWordcloud format
  const wordCloudData: WordCloudData[] = Object.entries(wordCount)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);

  // Find min and max values for normalization
  const maxValue = Math.max(...wordCloudData.map(word => word.value));
  const minValue = Math.min(...wordCloudData.map(word => word.value));

  // Normalize the values to 1-10
  return wordCloudData.map(word => ({
    text: word.text,
    value: minValue === maxValue
      ? 5  // If all values are the same, set to middle of range
      : 1 + ((word.value - minValue) * (10 - 1)) / (maxValue - minValue)
  }));
};

interface ImageDimensions {
  width: number;
  height: number;
}

// Helper function to convert base64 to image
export const base64ToImage = (base64: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      resolve(img);
    };

    img.onerror = (error) => {
      reject(new Error(`Failed to load image: ${error}`));
    };

    try {
      if (!base64.startsWith('data:image')) {
        base64 = `data:image/png;base64,${base64}`;
      }
      img.src = base64;
    } catch (error) {
      reject(new Error(`Invalid base64 data: ${error}`));
    }
  });
};

// Get image dimensions
export const getImageDimensions = (imageUrl: string): Promise<ImageDimensions> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.src = imageUrl;
  });
};

export const generateHeatmapOverlay = async (
  baseImageDimensions: ImageDimensions,
  highlightAreas: string[]
): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = baseImageDimensions.width;
  canvas.height = baseImageDimensions.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.clearRect(0, 0, baseImageDimensions.width, baseImageDimensions.height);
  ctx.globalCompositeOperation = 'screen';

  // Process each highlight
  for (const base64Data of highlightAreas) {
    try {
      const fullBase64 = base64Data.startsWith('data:image')
        ? base64Data
        : `data:image/png;base64,${base64Data}`;

      const img = await base64ToImage(fullBase64);

      ctx.globalAlpha = 0.2;
      ctx.drawImage(img, 0, 0);

    } catch (error) {
      console.error('Error processing highlight:', error);
    }
  }

  // Apply color gradient
  const imageData = ctx.getImageData(0, 0, baseImageDimensions.width, baseImageDimensions.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const intensity = data[i];
    if (intensity > 0) {
      if (intensity < 128) {
        // Cold color (Blue)
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 255;
        data[i + 3] = Math.min(255, intensity * 2);
      } else {
        // Hot color (Red)
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = Math.min(255, intensity);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};


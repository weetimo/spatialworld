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

// function that takes in highlighted coordinates, and output heatmap data
export const generateHeatMapData = (
  coordinates: Array<{
    userId: string;
    coordinates: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
  }>,
  width: number,
  height: number
): string => {
  // Create an off-screen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw heat map
  coordinates.forEach(highlight => {
    const centerX = (highlight.coordinates.x1 + highlight.coordinates.x2) / 2;
    const centerY = (highlight.coordinates.y1 + highlight.coordinates.y2) / 2;

    const highlightWidth = Math.abs(highlight.coordinates.x2 - highlight.coordinates.x1);
    const highlightHeight = Math.abs(highlight.coordinates.y2 - highlight.coordinates.y1);
    const size = Math.sqrt(highlightWidth * highlightHeight);
    const radius = 30; // You can adjust this value

    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius + (size / 4)
    );

    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + (size / 4), 0, Math.PI * 2);
    ctx.fill();
  });

  // Apply color transformation
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha > 0) {
      data[i] = 255;
      data[i + 1] = Math.min(255, alpha * 2);
      data[i + 2] = Math.min(255, alpha);
      data[i + 3] = Math.min(255, alpha * 2);
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Convert canvas to data URL
  return canvas.toDataURL('image/png');
};

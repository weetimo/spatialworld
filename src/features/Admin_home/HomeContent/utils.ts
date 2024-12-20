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
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren’t', 'as',
    'at','add', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot',
    'could', 'couldn’t', 'did', 'didn’t', 'do', 'does', 'doesn’t', 'doing', 'don’t', 'down', 'during', 'each',
    'few', 'for', 'from', 'further', 'generate','had', 'hadn’t', 'has', 'hasn’t', 'have', 'haven’t', 'having', 'he', 'he’d',
    'he’ll', 'he’s', 'her', 'here', 'here’s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how’s', 'i',
    'i’d', 'i’ll', 'i’m', 'i’ve', 'if', 'in', 'into', 'is', 'isn’t', 'it', 'it’s', 'its', 'itself', 'let’s', 'me',
    'more', 'most','make', 'mustn’t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
    'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own','users','user', 'same', 'shan’t', 'she', 'she’d',
    'she’ll', 'she’s', 'should', 'shouldn’t', 'so', 'some','see', 'such', 'than', 'that', 'that’s', 'the', 'their',
    'theirs', 'them', 'themselves', 'then', 'there', 'there’s', 'these', 'they', 'they’d', 'they’ll', 'they’re',
    'they’ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn’t', 'we',
    'we’d', 'we’ll','well', 'we’re', 'we’ve', 'were', 'weren’t', 'what','want', 'what’s', 'when', 'when’s', 'where', 'where’s',
    'which', 'while', 'who', 'who’s', 'whom', 'why', 'why’s', 'with', 'won’t', 'would', 'wouldn’t', 'you', 'you’d',
    'you’ll', 'you’re', 'you’ve', 'your', 'yours', 'yourself', 'yourselves','1','2','3','4','5','6','7','8','9','10'
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

export const generateHeatMapData = (
  coordinates: Array<{ x: number; y: number }>,
  width: number,
  height: number
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  coordinates.forEach(point => {
    const radius = 20; // You can adjust this value
    const gradient = ctx.createRadialGradient(
      point.x, point.y, 0,
      point.x, point.y, radius
    );

    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
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

  return canvas.toDataURL('image/png');
};

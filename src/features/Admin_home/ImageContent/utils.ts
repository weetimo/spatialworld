export const stringToPastelColor = (str?: string): string => {
  if (!str) return '#e5e7eb';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  const s = 70; 
  const l = 80; 
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const lightenColor = (color: string, amount: number): string => {
  if (color.startsWith('hsl')) {
    const [h, s, l] = color.match(/\d+/g)!.map(Number);
    const newL = Math.min(100, l + amount);
    return `hsl(${h}, ${s}%, ${newL}%)`;
  }
  return color;
};

export const calculateStats = (generations: any[]) => {
  const categoryCounts = generations.reduce((acc: Record<string, number>, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const total = generations.length;
  const distributionStats = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: (count / total) * 100,
    color: stringToPastelColor(category)
  }));

  return { distributionStats };
};
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface AgeDataPoint {
  ageGroup: string;
  count: number;
}

const defaultAgeData: AgeDataPoint[] = [
  { ageGroup: '18-24', count: 245 },
  { ageGroup: '25-34', count: 384 },
  { ageGroup: '35-44', count: 298 },
  { ageGroup: '45-64', count: 426 },
  { ageGroup: '65+', count: 172 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4B4B'];

interface QuestionnaireProps {
  data?: AgeDataPoint[];
  onDataUpdate?: (data: AgeDataPoint[]) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ 
  data = defaultAgeData,
  onDataUpdate
}) => {
  const [chartData, setChartData] = useState<AgeDataPoint[]>(data);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('chart-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDone = () => {
    onDataUpdate?.(chartData);
  };

  return (
    <Box sx={{ padding: '1rem' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Questionnaire Results
      </Typography>
      
      <Box id="chart-container" sx={{ width: '100%', height: 400, mb: 4 }}>
        <BarChart
          width={containerWidth || 800}
          height={400}
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 60,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="ageGroup" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#FF4B4B" name="Respondents" />
        </BarChart>
      </Box>

      <Box sx={{ display: 'flex', height: 400 }}>
        <Box sx={{ width: '50%' }}>
          <PieChart width={containerWidth / 2} height={400}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="count"
              nameKey="ageGroup"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Box>
      </Box>
      
      <Button 
        variant="contained" 
        sx={{ mt: 2 }}
        onClick={handleDone}
      >
        Done
      </Button>
    </Box>
  );
};

export default Questionnaire;
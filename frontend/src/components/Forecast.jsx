import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Forecast = ({ data, forecast, color }) => {
  if (!forecast) return null;

  const combinedData = [...data, ...forecast];

  return (
    <Card title="Data Forecast" className="mt-8">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={color} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Forecast;
import React from 'react';
import { Card, Spin } from 'antd';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Visualization = ({ loading, response, data, chartType, color }) => {
  const renderChart = () => {
    switch(chartType) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={color} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie dataKey="value" data={data} fill={color} label />
            <Tooltip />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {loading && <Spin size="large" />}
      {response && (
        <Card title="Generated Graph" className="mt-8">
          <img
            src={`data:image/png;base64,${response.graph}`}
            alt="Generated Graph"
            className="w-full"
          />
        </Card>
      )}
      {data.length > 0 && (
        <Card title="Live Preview" className="mt-8">
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </Card>
      )}
    </>
  );
};

export default Visualization;
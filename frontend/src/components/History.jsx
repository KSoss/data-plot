import React from 'react';
import { Card, Button } from 'antd';

const History = ({ dataHistory, loadDataset }) => {
  if (dataHistory.length === 0) return null;

  return (
    <Card title="Data History" className="mt-8">
      {dataHistory.map((item, index) => (
        <Button
          key={index}
          onClick={() => loadDataset(item)}
          className="mr-2 mb-2"
        >
          Load Dataset {index + 1}
        </Button>
      ))}
    </Card>
  );
};

export default History;
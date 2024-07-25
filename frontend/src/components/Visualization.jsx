import React from 'react';
import { Card, Spin, Empty } from 'antd';

const Visualization = ({ loading, response }) => {
  return (
    <Card title="Generated Graph" className="mt-8">
      {loading ? (
        <Spin size="large" />
      ) : response?.graph ? (
        <img
          src={`data:image/png;base64,${response.graph}`}
          alt="Generated Graph"
          className="w-full"
        />
      ) : (
        <Empty
          description="Awaiting data generation"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default Visualization;
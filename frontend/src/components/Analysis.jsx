import React from 'react';
import { Card, Table, Empty } from 'antd';

const Analysis = ({ analysis }) => {
  if (!analysis) {
    return (
      <Card title="Data Analysis" className="mt-8">
        <Empty
          description="Awaiting data generation"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  const dataSource = Object.entries(analysis).map(([metric, value]) => ({
    key: metric,
    metric,
    value: typeof value === 'number' ? value.toFixed(2) : value,
  }));

  const columns = [
    { title: 'Metric', dataIndex: 'metric', key: 'metric' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  return (
    <Card title="Data Analysis" className="mt-8">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </Card>
  );
};

export default Analysis;
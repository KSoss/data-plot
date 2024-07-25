import React from 'react';
import { Card, Table, Empty } from 'antd';

const Analysis = ({ analysis, loading }) => {
  if (loading) {
    return (
      <Card title="Data Analysis" className="mt-8">
        <Empty
          description="Loading analysis..."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  if (!analysis || analysis.insufficient_data) {
    return (
      <Card title="Data Analysis" className="mt-8">
        <Empty
          description={analysis?.message || "Awaiting at least two data points for analysis"}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  const dataSource = Object.entries(analysis.analysis).map(([metric, value]) => ({
    key: metric,
    metric: metric.charAt(0).toUpperCase() + metric.slice(1).replace('_', ' '),
    value: typeof value === 'number' ? value.toFixed(2) : value.toString(),
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
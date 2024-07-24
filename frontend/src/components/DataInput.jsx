import React from 'react';
import { Form, Input, Button, Select, Upload, Row, Col, message } from 'antd';
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const DataInput = ({ data, setData, chartType, setChartType, color, setColor, handleSubmit, handleFileUpload, handleDownload }) => {
  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = field === 'value' ? Number(value) : value;
    setData(newData);
  };

  const handleAddClick = () => {
    setData([...data, { category: '', value: 0 }]);
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Chart Type">
            <Select value={chartType} onChange={setChartType}>
              <Option value="bar">Bar Chart</Option>
              <Option value="line">Line Chart</Option>
              <Option value="pie">Pie Chart</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Chart Color">
            <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Upload/Download Data">
            <Upload
              accept=".json"
              beforeUpload={(file) => {
                const isJSON = file.type === 'application/json';
                if (!isJSON) {
                  message.error('You can only upload JSON files!');
                }
                return isJSON;
              }}
              onChange={handleFileUpload}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={handleDownload} className="ml-2">
              Download
            </Button>
          </Form.Item>
        </Col>
      </Row>
      {data.map((item, index) => (
        <Row key={index} gutter={16} className="mb-4">
          <Col span={12}>
            <Form.Item label="Category" required>
              <Input
                value={item.category}
                onChange={(e) => handleChange(index, 'category', e.target.value)}
                placeholder="Enter category"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Value" required>
              <Input
                type="number"
                value={item.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                placeholder="Enter value"
              />
            </Form.Item>
          </Col>
        </Row>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={handleAddClick} block icon={<PlusOutlined />}>
          Add Data Point
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Generate Graph
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DataInput;
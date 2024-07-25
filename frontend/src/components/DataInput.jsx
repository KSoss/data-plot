import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Row, Col, Card, message } from 'antd';
import { PlusOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Option } = Select;

const DataInput = ({ 
  data, 
  setData, 
  chartType, 
  setChartType, 
  colors,
  setColors,
  handleSubmit, 
  handleFileUpload, 
  handleDownload 
}) => {
  const [tempCategories, setTempCategories] = useState(data.map(item => item.category));

  useEffect(() => {
    // Assign colors to any categories that don't have them
    const newColors = {...colors};
    let colorsChanged = false;
    data.forEach(item => {
      if (!(item.category in newColors)) {
        newColors[item.category] = getRandomColor();
        colorsChanged = true;
      }
    });
    if (colorsChanged) {
      setColors(newColors);
    }
  }, [data, colors, setColors]);

  const handleChange = (index, field, value) => {
    if (field === 'category') {
      const newTempCategories = [...tempCategories];
      newTempCategories[index] = value;
      setTempCategories(newTempCategories);
    } else {
      const newData = [...data];
      newData[index][field] = Number(value);
      setData(newData);
    }
  };

  const handleCategoryBlur = (index) => {
    const newCategory = tempCategories[index];
    if (newCategory && newCategory !== data[index].category) {
      const newData = [...data];
      const oldCategory = newData[index].category;
      newData[index].category = newCategory;
      setData(newData);

      // If the new category doesn't have a color, assign it the color of the old category or a new random color
      if (!(newCategory in colors)) {
        setColors(prevColors => ({
          ...prevColors,
          [newCategory]: prevColors[oldCategory] || getRandomColor()
        }));
      }
    }
  };

  const handleAddClick = () => {
    const newCategory = `Category ${data.length + 1}`;
    setData([...data, { category: newCategory, value: 0 }]);
    setTempCategories([...tempCategories, newCategory]);
    if (!(newCategory in colors)) {
      setColors(prevColors => ({
        ...prevColors,
        [newCategory]: getRandomColor()
      }));
    }
  };

  const handleColorChange = (category, color) => {
    setColors(prevColors => ({
      ...prevColors,
      [category]: color
    }));
  };

  const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

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
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[entry.category] || '#000000'} />
              ))}
            </Bar>
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
            <Line type="monotone" dataKey="value" stroke={Object.values(colors)[0] || '#000000'} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie dataKey="value" data={data} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[entry.category] || '#000000'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div>
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
          <Col span={16}>
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
            <Col span={8}>
              <Form.Item label="Category" required>
                <Input
                  value={tempCategories[index]}
                  onChange={(e) => handleChange(index, 'category', e.target.value)}
                  onBlur={() => handleCategoryBlur(index)}
                  placeholder="Enter category"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Value" required>
                <Input
                  type="number"
                  value={item.value}
                  onChange={(e) => handleChange(index, 'value', e.target.value)}
                  placeholder="Enter value"
                />
              </Form.Item>
            </Col>
            {chartType !== 'line' && (
              <Col span={8}>
                <Form.Item label="Color">
                  <Input
                    type="color"
                    value={colors[item.category] || '#000000'}
                    onChange={(e) => handleColorChange(item.category, e.target.value)}
                  />
                </Form.Item>
              </Col>
            )}
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
      
      {data.length > 0 && data[0].category && data[0].value && (
        <Card title="Live Preview" className="mt-8">
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default DataInput;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Tabs, Layout, Typography } from 'antd';
import DataInput from './components/DataInput';
import Visualization from './components/Visualization';
import Analysis from './components/Analysis';
import Forecast from './components/Forecast';
import History from './components/History';
import './index.css';

const { TabPane } = Tabs;
const { Content } = Layout;
const { Title } = Typography;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
console.log(API_URL);

const App = () => {
  const [data, setData] = useState([{ category: '', value: 0 }]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [colors, setColors] = useState({});
  const [dataHistory, setDataHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('dataHistory');
    if (savedHistory) {
      setDataHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSubmit = async () => {
    if (data.some(item => !item.category || item.value === 0)) {
      message.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/data`, { data, chartType, colors });
      setResponse(res.data);
      message.success('Data submitted successfully');

      const newHistory = [{ data, chartType, colors }, ...dataHistory.slice(0, 4)];
      setDataHistory(newHistory);
      localStorage.setItem('dataHistory', JSON.stringify(newHistory));

      try {
        const analysisRes = await axios.post(`${API_URL}/analyze`, { data });
        setAnalysis(analysisRes.data);
      } catch (analysisError) {
        console.error('Error analyzing data:', analysisError);
        message.error('Failed to analyze data: ' + (analysisError.response?.data?.error || analysisError.message));
      }

      try {
        const forecastRes = await axios.post(`${API_URL}/forecast`, { data });
        setForecast(forecastRes.data.forecast);
      } catch (forecastError) {
        console.error('Error forecasting data:', forecastError);
        message.error('Failed to forecast data: ' + (forecastError.response?.data?.error || forecastError.message));
      }

    } catch (error) {
      console.error('Error submitting data:', error);
      message.error('Failed to submit data: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (info) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          setData(parsedData);
          const newColors = {};
          parsedData.forEach(item => {
            if (!(item.category in colors)) {
              newColors[item.category] = getRandomColor();
            }
          });
          setColors({...colors, ...newColors});
          message.success(`${info.file.name} file uploaded successfully`);
        } catch (error) {
          message.error('Failed to parse JSON file');
        }
      };
      reader.readAsText(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const loadDataset = (item) => {
    setData(item.data);
    setChartType(item.chartType);
    setColors(item.colors);
  };

  const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content className="p-6 sm:p-10">
        <div className="max-w-6xl mx-auto">
          <Title level={2} className="text-center mb-8 text-gray-800">
            Graph Visualization and Generation
          </Title>
          <Tabs defaultActiveKey="1" type="card" className="dashboard-tabs">
            <TabPane tab="Data Input & Preview" key="1">
              <DataInput
                data={data}
                setData={setData}
                chartType={chartType}
                setChartType={setChartType}
                colors={colors}
                setColors={setColors}
                handleSubmit={handleSubmit}
                handleFileUpload={handleFileUpload}
                handleDownload={handleDownload}
              />
            </TabPane>
            <TabPane tab="Server-Generated Visualization" key="2">
              <Visualization
                loading={loading}
                response={response}
                data={data}
                chartType={chartType}
                colors={colors}
              />
            </TabPane>
            <TabPane tab="Analysis" key="3">
              <Analysis analysis={analysis} />
            </TabPane>
            <TabPane tab="Forecast" key="4">
              <Forecast data={data} forecast={forecast} colors={colors} />
            </TabPane>
            <TabPane tab="History" key="5">
              <History dataHistory={dataHistory} loadDataset={loadDataset} />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
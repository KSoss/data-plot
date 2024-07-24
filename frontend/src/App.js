import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Tabs } from 'antd';
import DataInput from './components/DataInput';
import Visualization from './components/Visualization';
import Analysis from './components/Analysis';
import Forecast from './components/Forecast';
import History from './components/History';

const { TabPane } = Tabs;

const API_URL = 'http://localhost:5000';

const App = () => {
  const [data, setData] = useState([{ category: '', value: 0 }]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [color, setColor] = useState('#1890ff');
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
      const res = await axios.post(`${API_URL}/data`, { data, chartType, color });
      setResponse(res.data);
      message.success('Data submitted successfully');

      const newHistory = [{ data, chartType, color }, ...dataHistory.slice(0, 4)];
      setDataHistory(newHistory);
      localStorage.setItem('dataHistory', JSON.stringify(newHistory));

      const analysisRes = await axios.post(`${API_URL}/analyze`, { data });
      setAnalysis(analysisRes.data);

      const forecastRes = await axios.post(`${API_URL}/forecast`, { data });
      setForecast(forecastRes.data.forecast);

    } catch (error) {
      console.error('Error submitting data:', error);
      message.error('Failed to submit data');
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
    setColor(item.color);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Advanced Data Visualization Dashboard</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Data Input" key="1">
          <DataInput
            data={data}
            setData={setData}
            chartType={chartType}
            setChartType={setChartType}
            color={color}
            setColor={setColor}
            handleSubmit={handleSubmit}
            handleFileUpload={handleFileUpload}
            handleDownload={handleDownload}
          />
        </TabPane>
        <TabPane tab="Visualization" key="2">
          <Visualization
            loading={loading}
            response={response}
            data={data}
            chartType={chartType}
            color={color}
          />
        </TabPane>
        <TabPane tab="Analysis" key="3">
          <Analysis analysis={analysis} />
        </TabPane>
        <TabPane tab="Forecast" key="4">
          <Forecast data={data} forecast={forecast} color={color} />
        </TabPane>
        <TabPane tab="History" key="5">
          <History dataHistory={dataHistory} loadDataset={loadDataset} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default App;
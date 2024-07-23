import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState([{ category: '', value: 0 }]);
    const [response, setResponse] = useState(null);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...data];
        list[index][name] = name === 'value' ? Number(value) : value;
        setData(list);
    };

    const handleAddClick = () => {
        setData([...data, { category: '', value: 0 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/data', { data });
            setResponse(res.data);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div className="App">
            <h1>Data Creation</h1>
            <form onSubmit={handleSubmit}>
                {data.map((item, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="category"
                            value={item.category}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Enter category"
                        />
                        <input
                            type="number"
                            name="value"
                            value={item.value}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Enter value"
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddClick}>Add</button>
                <button type="submit">Submit</button>
            </form>
            {response && (
                <div>
                    <h2>Generated Graph</h2>
                    <img src={`data:image/png;base64,${response.graph}`} alt="Generated Graph" />
                </div>
            )}
        </div>
    );
}

export default App;

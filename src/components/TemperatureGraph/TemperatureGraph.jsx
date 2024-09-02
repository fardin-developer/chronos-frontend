import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import './TemperatureGraph.css';

const TemperatureGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:80/chart_data');
        const result = await response.json();

        // Transform the API response into the desired format
        const mappedData = result.map((entry, index) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const date = new Date(entry.date);
          const month = monthNames[date.getMonth()];  

          return {
            name: month,
            inlet: entry["column-2"],
            outlet: entry["column-1"],
          };
        });

        setData(mappedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const convertToCSV = (arr) => {
    const array = [Object.keys(arr[0])].concat(arr);
    return array.map(it => Object.values(it).toString()).join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'temperature_log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="graph-container">
      <div className="graphbody">
        <h3>Inlet/Outlet Temperature History</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid stroke="#4c5c77" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#dddddd">
              <Label value="Month" offset={-5} position="insideBottom" fill="#dddddd" style={{textAnchor:'middle'}}/>
            </XAxis>
            <YAxis domain={[30, 90]} stroke="#dddddd">
              <Label value="Temperature" angle={-90} position="insideLeft" fill="#dddddd" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip contentStyle={{ backgroundColor: '#333645', borderColor: '#4c5c77', color: '#ffffff' }} />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ color: '#dddddd' }} />
            <Line type="monotone" dataKey="inlet" stroke="#ffca28" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="outlet" stroke="#ff7043" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <button className="download-button" onClick={downloadCSV}>Download log</button>
      </div>
    </div>
  );
};

export default TemperatureGraph;

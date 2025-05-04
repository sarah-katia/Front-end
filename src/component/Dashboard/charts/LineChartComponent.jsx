import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: '0.5px solid #ccc',
        padding: '8px',
        borderRadius: '8px',
        fontFamily: 'Poppins',
        fontSize: '14px',
        color: '#1976d2',
      }}>
        <p style={{ margin: 0, fontWeight: '500' }}>{label}</p>
        <p style={{ margin: 0 }}>{`Publications: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const LineChartComponent = ({ title, data, width = 450, height = 300 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '10px',
        minWidth: `${width}px`,
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          fontFamily: 'Poppins',
          marginBottom: '10px',
          color: '#1976d2',
          textAlign: 'center'
        }}>
          {title}
        </h2>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" fontSize={12} />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="publications" stroke="#00b894" strokeWidth={2} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;

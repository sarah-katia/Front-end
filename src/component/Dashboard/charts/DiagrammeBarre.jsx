import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function CustomTooltip({ active, payload, label }) {
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
}

function DiagrammeBarre({ data, width = 450, height = 300 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{
        fontSize: '18px',
        fontWeight: '600',
        fontFamily: 'Poppins',
        marginBottom: '10px',
        color: '#1976d2',
        textAlign: 'center'
      }}>
        Chercheur avec le plus de publication en 2024
      </h2>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '10px',
        minWidth: '450px',
      }}>
        <BarChart width={width} height={height} data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" fontSize={12} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#1976B4" barSize={15} borderRadius={20} activeBar={{ fill: '#249CF4' }}  />
        </BarChart>
      </div>
    </div>
  );
}

export default DiagrammeBarre;

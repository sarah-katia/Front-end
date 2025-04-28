import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" barSize={15} borderRadius={20} activeBar={{ fill: '#1976b4' }} />
        </BarChart>
      </div>
    </div>
  );
}

export default DiagrammeBarre;

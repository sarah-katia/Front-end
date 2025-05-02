import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

function GroupedBarChart({ title , data, width = 450, height = 300 }) {
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
        {title}
      </h2>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '10px',
        minWidth: '455px',
      }}>
        <BarChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-45} fontSize={12} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="top"
            iconType="circle"
            wrapperStyle={{ top: 0, left: 30 }}
          />
          <Bar dataKey="publications" fill="#1976B4" barSize={15} activeBar={{ fill: '#249CF4' }} />
          <Bar dataKey="projets" fill="#A1F7B9" barSize={15} activeBar={{ fill: '#71ef95' }} />
        </BarChart>
      </div>
    </div>
  );
}

export default GroupedBarChart;

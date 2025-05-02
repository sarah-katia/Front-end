import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#1976B4', '#249CF4', '#A1F7B9', '#121619', 'rgb(205, 207, 207)'];

function DiagrammeRondCard({ title, data, width = 300, height = 300 }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
       border: '0.5px solid #3498db',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '453px',
      minHeight: '100px'
    }}>
      <h2 style={{ fontSize: '20px', marginBottom: '0px', color: '#1976b4' }}>{title}</h2>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}`} />
        </PieChart>

        <div style={{ marginLeft: '20px' }}>
          {data.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: COLORS[index % COLORS.length],
                marginRight: '8px',
                borderRadius: '2px'
              }} />
              <span style={{ fontSize: '14px', color: '#555' }}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiagrammeRondCard;

import { PieChart, Pie, Cell } from 'recharts';

function PetitRondStatistique({ percentage, color = "#8884d8" }) {
  const data = [
    { name: 'Rempli', value: percentage },
    { name: 'Vide', value: 100 - percentage },
  ];

  return (
    <PieChart width={100} height={100}>
      <Pie
        data={data}
        startAngle={90}
        endAngle={-270}
        cx="50%"
        cy="50%"
        innerRadius={30}
        outerRadius={40}
        paddingAngle={5}
        dataKey="value"
      >
        <Cell fill={color} />
        <Cell fill="#f0f0f0" />
      </Pie>
    </PieChart>
  );
}

export default PetitRondStatistique;

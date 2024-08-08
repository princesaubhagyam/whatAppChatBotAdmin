import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Cell } from 'recharts';

const colors = ['#00FF00', '#808080', '#0000FF', '#FFFF00', '#FF0000'];

const graphData = [
  { name: 'Send', value: 100 },
  { name: 'Deliver', value: 100 },
  { name: 'Read', value: 70 },
  { name: 'Reply', value: 30 },
  { name: 'Fail', value: 10 },
];

const coloredData = graphData.map((entry, index) => ({
  ...entry,
  fill: colors[index % colors.length],
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}
      >
        <p className="label" style={{ fontWeight: 'bold' }}>{`${label}`}</p>
        <p className="intro">{`Value: ${payload[0].value}%`}</p>
      </div>
    );
  }
};
const BarGraph = () => (
  <BarChart width={900} height={500} data={coloredData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Bar dataKey="value" barSize={50}>
      {coloredData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.fill} />
      ))}
      {/* <LabelList dataKey="value" position="top" /> */}
    </Bar>
  </BarChart>
);

export default BarGraph;

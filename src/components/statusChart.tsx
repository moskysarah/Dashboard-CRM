import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  data: { name: string; value: number }[];
  title: string;
}

const COLORS = ["#4F46E5", "#EF4444", "#10B981", "#F59E0B"];

const StatusChart: React.FC<Props> = ({ data, title }) => (
  <div className="bg-white p-4 rounded-2xl shadow w-full mb-6">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default StatusChart;

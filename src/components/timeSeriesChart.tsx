import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; value: number }[];
  title: string;
}

const TimeseriesChart: React.FC<Props> = ({ data, title }) => (
  <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
    <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#f9fafb',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TimeseriesChart;

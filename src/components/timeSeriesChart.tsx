import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; value: number }[];
  title: string;
}

const TimeseriesChart: React.FC<Props> = ({ data, title }) => (
  <div className="bg-white p-4 rounded-2xl shadow w-full mb-6">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TimeseriesChart;

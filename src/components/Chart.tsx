import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { financeChartData, salesChartData } from "../api/fakeAPI";
import { useTranslation } from "react-i18next";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Chart: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">{t("finance")}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={financeChartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#0088FE" name={t("revenue")} />
            <Bar dataKey="expenses" fill="#FF8042" name={t("expenses")} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">{t("sales")}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={salesChartData} dataKey="value" nameKey="product" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {salesChartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;

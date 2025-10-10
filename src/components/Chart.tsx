import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchFinanceData, fetchSalesData } from "../services/chart";
import type { FinanceData, SalesData } from "../services/chart";
import { useTranslationContext } from "../contexts/translateContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Chart: React.FC = () => {
  const { translate } = useTranslationContext();

  const [financeChartData, setFinanceChartData] = useState<FinanceData[]>([]);
  const [salesChartData, setSalesChartData] = useState<SalesData[]>([]);
  const [translatedLabels, setTranslatedLabels] = useState({
    finance: "Finance",
    revenue: "Revenue",
    expenses: "Expenses",
    sales: "Sales",
  });
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);

  // Traduction des labels statiques
  useEffect(() => {
    const translateLabels = async () => {
      setTranslatedLabels({
        finance: await translate("Finance"),
        revenue: await translate("Revenue"),
        expenses: await translate("Expenses"),
        sales: await translate("Sales"),
      });
    };
    translateLabels();
  }, [translate]);

  // Récupération des données du backend
  useEffect(() => {
    fetchFinanceData()
      .then(setFinanceChartData)
      .catch((err) => console.error(err));
    fetchSalesData()
      .then(setSalesChartData)
      .catch((err) => console.error(err));
  }, []);

  // Pré-traduction des données pour PieChart (async sécurisé)
  useEffect(() => {
    const preparePieData = async () => {
      const translated = await Promise.all(
        salesChartData.map(async (item) => ({
          name: await translate(item.product), // traduction Google API
          value: item.value,
        }))
      );
      setPieData(translated);
    };
    preparePieData();
  }, [salesChartData, translate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Finance Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">{translatedLabels.finance}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={financeChartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#0088FE" name={translatedLabels.revenue} />
            <Bar dataKey="expenses" fill="#FF8042" name={translatedLabels.expenses} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">{translatedLabels.sales}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData} // données déjà traduites
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name }) => name} // nom déjà traduit
            >
              {pieData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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

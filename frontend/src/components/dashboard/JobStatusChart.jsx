import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const JobStatusChart = ({ stats }) => {
  const data = [
    { name: "Pendientes", value: stats.pending, color: "#FBBF24" }, // yellow-400
    { name: "En Progreso", value: stats.inProgress, color: "#2563EB" }, // blue-600
    { name: "Completados", value: stats.completed, color: "#16A34A" }, // green-600
    { name: "Cancelados", value: stats.cancelled, color: "#DC2626" }, // red-600
  ];

  // Filter out zero values to avoid empty segments or clutter
  const activeData = data.filter((item) => item.value > 0);

  if (stats.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow rounded-lg p-6 flex flex-col items-center"
    >
      <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4 w-full text-left">
        Estado de Trabajos
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={activeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {activeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default JobStatusChart;

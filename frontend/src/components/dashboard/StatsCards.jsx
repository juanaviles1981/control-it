import React from "react";
import { motion } from "framer-motion";

const StatsCards = ({ stats, timeRange, setTimeRange }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-end mb-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        >
          <option value="all">Todo el tiempo</option>
          <option value="week">Última Semana</option>
          <option value="month">Último Mes</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Pending Jobs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Trabajos Pendientes
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.pendingJobs}
            </dd>
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Insumos Bajos
            </dt>
            <dd
              className={`mt-1 text-3xl font-semibold ${
                stats.lowStockItems > 0 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {stats.lowStockItems}
            </dd>
          </div>
        </motion.div>

        {/* Completed Jobs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Trabajos Completados
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">
              {stats.completedJobs}
            </dd>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsCards;

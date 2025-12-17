import React from "react";
import { motion } from "framer-motion";

const StockAlerts = ({ lowStockList }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow rounded-lg p-6"
    >
      <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Alertas de Stock
      </h2>
      {lowStockList.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {lowStockList.map((item) => (
            <li
              key={item.id}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">Mínimo: {item.minStock}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Stock: {item.stock}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay alertas de stock.
        </p>
      )}
    </motion.div>
  );
};

export default StockAlerts;

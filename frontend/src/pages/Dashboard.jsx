import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    pendingJobs: 0,
    lowStockItems: 0,
    completedJobs: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, inventoryRes] = await Promise.all([
          apiRequest('/jobs'),
          apiRequest('/inventory')
        ]);

        if (jobsRes.ok && inventoryRes.ok) {
          const jobs = await jobsRes.json();
          const inventory = await inventoryRes.json();

          // Count pending jobs (statusId 1 = Pendiente)
          const pending = jobs.filter(job => job.statusId === 1).length;
          
          // Count completed jobs (statusId 3 = Completado)
          const completed = jobs.filter(job => job.statusId === 3).length;
          
          // Count low stock items (stock <= minStock)
          const lowStock = inventory.filter(item => item.stock <= item.minStock).length;

          setStats({
            pendingJobs: pending,
            lowStockItems: lowStock,
            completedJobs: completed
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Trabajos Pendientes</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingJobs}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Insumos Bajos</dt>
            <dd className={`mt-1 text-3xl font-semibold ${stats.lowStockItems > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {stats.lowStockItems}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Trabajos Completados</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.completedJobs}</dd>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Actividad Reciente</h2>
        <div className="mt-4 bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Dashboard actualizado con estadísticas en tiempo real.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

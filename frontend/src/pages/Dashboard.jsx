import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import { showSuccessToast } from '../utils/notifications';
import { SiOpenai, SiYoutube, SiAnydesk } from 'react-icons/si';
import { FaProjectDiagram } from 'react-icons/fa';

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

  const handleAnyDeskClick = (e) => {
    e.preventDefault();
    showSuccessToast('🚀 Iniciando AnyDesk...');
    setTimeout(() => {
      window.location.href = 'anydesk:';
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar de Utilidades */}
      <aside className="w-full lg:w-20 flex-shrink-0 transition-all duration-300">
        <div className="bg-white shadow-lg rounded-2xl p-4 sticky top-24 flex flex-col items-center gap-4 border border-gray-100">

          <div className="p-2 bg-indigo-50 rounded-xl mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {/* ChatGPT */}
            <a
              href="https://chat.openai.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="ChatGPT"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-green-100 hover:text-green-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
            >
              <SiOpenai size={24} />
            </a>

            {/* Fast.com */}
            <a
              href="https://fast.com/es/"
              target="_blank"
              rel="noopener noreferrer"
              title="Fast.com"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-800 hover:bg-black hover:text-white hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto font-bold text-[10px]"
            >
              FAST
            </a>

            {/* AnyDesk */}
            <a
              href="anydesk:"
              onClick={handleAnyDeskClick}
              title="AnyDesk"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
            >
              <SiAnydesk size={24} />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-red-100 hover:text-red-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
            >
              <SiYoutube size={24} />
            </a>

            {/* Lucidchart */}
            <a
              href="https://www.lucidchart.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Lucidchart"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-orange-100 hover:text-orange-600 hover:scale-110 hover:shadow-md transition-all duration-300 mx-auto"
            >
              <FaProjectDiagram size={24} />
            </a>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
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

        <div>
          <h2 className="text-lg leading-6 font-medium text-gray-900">Actividad Reciente</h2>
          <div className="mt-4 bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Dashboard actualizado con estadísticas en tiempo real.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import Layout from '../components/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Trabajos Pendientes</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Insumos Bajos</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Trabajos Completados</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Actividad Reciente</h2>
        <div className="mt-4 bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">No hay actividad reciente.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

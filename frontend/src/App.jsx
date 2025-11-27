import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JobBoard from './components/JobBoard';
import JobForm from './components/JobForm';
import InventoryTable from './components/InventoryTable';
import InventoryForm from './components/InventoryForm';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/new" element={<JobForm />} />
          <Route path="/jobs/:id/edit" element={<JobForm />} />
          <Route path="/inventory" element={<InventoryTable />} />
          <Route path="/inventory/new" element={<InventoryForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

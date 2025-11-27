import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusId, setStatusId] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  
  const [statuses, setStatuses] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, serviceRes, inventoryRes] = await Promise.all([
          apiRequest('/meta/statuses'),
          apiRequest('/meta/service-types'),
          apiRequest('/inventory')
        ]);

        if (statusRes.ok) setStatuses(await statusRes.json());
        if (serviceRes.ok) setServiceTypes(await serviceRes.json());
        if (inventoryRes.ok) setInventory(await inventoryRes.json());

        // If edit mode, fetch job details
        if (isEditMode) {
          const jobRes = await apiRequest(`/jobs/${id}`);
          if (jobRes.ok) {
            const job = await jobRes.json();
            setTitle(job.title);
            setDescription(job.description || '');
            setDate(new Date(job.date).toISOString().split('T')[0]);
            setStatusId(job.statusId);
            setServiceTypeId(job.serviceTypeId);
            // Map itemsUsed to selectedItems format
            if (job.itemsUsed) {
              setSelectedItems(job.itemsUsed.map(ji => ({
                itemId: ji.itemId,
                quantity: ji.quantity
              })));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { itemId: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index][field] = value;
    setSelectedItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      title,
      description,
      date,
      statusId,
      serviceTypeId,
      items: selectedItems.filter(item => item.itemId && item.quantity > 0)
    };

    try {
      const endpoint = isEditMode ? `/jobs/${id}` : '/jobs';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await apiRequest(endpoint, {
        method: method,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(isEditMode ? 'Trabajo actualizado exitosamente' : 'Trabajo creado exitosamente');
        navigate('/jobs');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Error al guardar el trabajo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEditMode ? 'Editar Trabajo' : 'Nuevo Trabajo'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">Complete la información del trabajo realizado.</p>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  required
                  value={statusId}
                  onChange={(e) => setStatusId(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Seleccione un estado</option>
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Tipo de Servicio</label>
              <div className="mt-1">
                <select
                  id="serviceType"
                  name="serviceType"
                  required
                  value={serviceTypeId}
                  onChange={(e) => setServiceTypeId(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Seleccione un tipo</option>
                  {serviceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-900">Inventario Utilizado</h4>
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 mt-2">
                  <select
                    value={item.itemId}
                    onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Seleccione un ítem</option>
                    {inventory.map(invItem => (
                      <option key={invItem.id} value={invItem.id}>{invItem.name} (Stock: {invItem.stock})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Agregar Ítem
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button type="button" onClick={() => navigate('/jobs')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancelar
          </button>
          <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Guardar
          </button>
        </div>
      </div>
    </form>
  );
};

export default JobForm;

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { apiRequest } from "../utils/api";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const EquipmentManagement = () => {
  const [sectors, setSectors] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [sectorName, setSectorName] = useState("");
  const [sectorRack, setSectorRack] = useState("");
  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    anydeskNumber: "",
    computerType: "",
    connectionType: "",
    connectionDetails: "",
    sectorId: "",
  });
  const [isEditingSector, setIsEditingSector] = useState(null);
  const [isEditingEquipment, setIsEditingEquipment] = useState(null);

  // Searchable dropdown states
  const [sectorSearch, setSectorSearch] = useState("");
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [filteredSectors, setFilteredSectors] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sectorsRes, equipmentRes] = await Promise.all([
        apiRequest("/sectors"),
        apiRequest("/equipment"),
      ]);
      const sectorsData = await sectorsRes.json();
      const equipmentData = await equipmentRes.json();
      setSectors(sectorsData);
      setEquipment(equipmentData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter sectors based on search term
  useEffect(() => {
    if (sectorSearch) {
      const filtered = sectors.filter((sector) =>
        sector.name.toLowerCase().includes(sectorSearch.toLowerCase())
      );
      setFilteredSectors(filtered);
    } else {
      setFilteredSectors(sectors);
    }
  }, [sectorSearch, sectors]);

  // Update search text when editing equipment
  useEffect(() => {
    if (equipmentForm.sectorId) {
      const selectedSector = sectors.find(
        (s) => s.id === parseInt(equipmentForm.sectorId)
      );
      if (selectedSector) {
        setSectorSearch(selectedSector.name);
      }
    } else {
      setSectorSearch("");
    }
  }, [equipmentForm.sectorId, sectors]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".sector-dropdown-container")) {
        setShowSectorDropdown(false);
      }
    };

    if (showSectorDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSectorDropdown]);

  // Sector Handlers
  const handleSectorSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditingSector ? `/sectors/${isEditingSector}` : "/sectors";
      const method = isEditingSector ? "PUT" : "POST";

      const res = await apiRequest(url, {
        method,
        headers: { "Content-Type": "application/json" },
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sectorName, rack: sectorRack }),
      });

      if (res.ok) {
        Swal.fire(
          "Éxito",
          `Sector ${isEditingSector ? "actualizado" : "creado"} correctamente`,
          "success"
        );
        setSectorName("");
        setSectorRack("");
        setIsEditingSector(null);
        fetchData();
      } else {
        throw new Error("Error saving sector");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el sector", "error");
    }
  };

  const handleDeleteSector = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará el sector y podría afectar equipos asociados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        const res = await apiRequest(`/sectors/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire("Eliminado", "Sector eliminado", "success");
          fetchData();
        } else {
          throw new Error("Error deleting sector");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el sector", "error");
      }
    }
  };

  // Equipment Handlers
  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditingEquipment
        ? `/equipment/${isEditingEquipment}`
        : "/equipment";
      const method = isEditingEquipment ? "PUT" : "POST";

      const res = await apiRequest(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(equipmentForm),
      });

      if (res.ok) {
        Swal.fire(
          "Éxito",
          `Equipo ${
            isEditingEquipment ? "actualizado" : "creado"
          } correctamente`,
          "success"
        );
        setEquipmentForm({
          name: "",
          anydeskNumber: "",
          computerType: "",
          connectionType: "",
          connectionDetails: "",
          sectorId: "",
        });
        setSectorSearch("");
        setShowSectorDropdown(false);
        setIsEditingEquipment(null);
        fetchData();
      } else {
        throw new Error("Error saving equipment");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el equipo", "error");
    }
  };

  const handleDeleteEquipment = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        const res = await apiRequest(`/equipment/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire("Eliminado", "Equipo eliminado", "success");
          fetchData();
        } else {
          throw new Error("Error deleting equipment");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el equipo", "error");
      }
    }
  };

  // Table Columns
  const sectorColumns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
      maxWidth: "200px",
    },
    {
      name: "Rack",
      selector: (row) => row.rack || "-",
      sortable: true,
      grow: 1,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => {
              setSectorName(row.name);
              setSectorRack(row.rack || "");
              setIsEditingSector(row.id);
            }}
            className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md font-medium transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => handleDeleteSector(row.id)}
            className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      ),
      width: "160px",
      right: true,
    },
  ];

  const equipmentColumns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
      grow: 1.5,
    },
    {
      name: "AnyDesk",
      selector: (row) => row.anydeskNumber,
      sortable: true,
      maxWidth: "120px",
    },
    {
      name: "Tipo",
      selector: (row) => row.computerType,
      sortable: true,
      maxWidth: "100px",
    },
    {
      name: "Sector",
      selector: (row) => row.sector?.name || "Sin Sector",
      sortable: true,
      maxWidth: "120px",
    },
    {
      name: "Conexión",
      selector: (row) => row.connectionType || "-",
      sortable: true,
      cell: (row) => (
        <div className="text-xs">
          <div className="font-medium">{row.connectionType || "-"}</div>
          {row.connectionDetails && (
            <div
              className="text-gray-500 truncate"
              title={row.connectionDetails}
            >
              {row.connectionDetails}
            </div>
          )}
        </div>
      ),
      maxWidth: "140px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => {
              setEquipmentForm({
                name: row.name,
                anydeskNumber: row.anydeskNumber,
                computerType: row.computerType,
                connectionType: row.connectionType || "",
                connectionDetails: row.connectionDetails || "",
                sectorId: row.sectorId,
              });
              setIsEditingEquipment(row.id);
            }}
            className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md font-medium transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => handleDeleteEquipment(row.id)}
            className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      ),
      width: "140px",
      right: true,
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f3f4f6",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        paddingTop: "8px",
        paddingBottom: "8px",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-bold text-gray-900">
        Gestión de Equipos y Sectores
      </h2>

      <div className="space-y-8">
        {/* Sectors Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Sectores</h3>
          <form onSubmit={handleSectorSubmit} className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Nombre del Sector"
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Rack (Opcional)"
              value={sectorRack}
              onChange={(e) => setSectorRack(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {isEditingSector ? "Actualizar" : "Agregar"}
              </button>
              {isEditingSector && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSector(null);
                    setSectorName("");
                    setSectorRack("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
          <DataTable
            columns={sectorColumns}
            data={sectors}
            pagination
            customStyles={customStyles}
            progressPending={loading}
          />
        </div>

        {/* Equipment Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Equipos</h3>
          <form onSubmit={handleEquipmentSubmit} className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nombre Equipo"
                value={equipmentForm.name}
                onChange={(e) =>
                  setEquipmentForm({ ...equipmentForm, name: e.target.value })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="AnyDesk"
                value={equipmentForm.anydeskNumber}
                onChange={(e) =>
                  setEquipmentForm({
                    ...equipmentForm,
                    anydeskNumber: e.target.value,
                  })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Tipo (PC, Notebook...)"
                value={equipmentForm.computerType}
                onChange={(e) =>
                  setEquipmentForm({
                    ...equipmentForm,
                    computerType: e.target.value,
                  })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={equipmentForm.connectionType}
                onChange={(e) =>
                  setEquipmentForm({
                    ...equipmentForm,
                    connectionType: e.target.value,
                  })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Tipo Conexión (Opcional)</option>
                <option value="Cable">Cable</option>
                <option value="WiFi">WiFi</option>
                <option value="Switch">Switch</option>
              </select>
              <input
                type="text"
                placeholder="Detalle Conexión (Boca/SSID)"
                value={equipmentForm.connectionDetails}
                onChange={(e) =>
                  setEquipmentForm({
                    ...equipmentForm,
                    connectionDetails: e.target.value,
                  })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <div className="relative sector-dropdown-container">
                <input
                  type="text"
                  placeholder="Buscar o seleccionar sector..."
                  value={sectorSearch}
                  onChange={(e) => {
                    setSectorSearch(e.target.value);
                    setShowSectorDropdown(true);
                  }}
                  onFocus={() => setShowSectorDropdown(true)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required={!equipmentForm.sectorId}
                  autoComplete="off"
                />
                {showSectorDropdown && filteredSectors.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredSectors.map((sector) => (
                      <div
                        key={sector.id}
                        onClick={() => {
                          setEquipmentForm({
                            ...equipmentForm,
                            sectorId: sector.id,
                          });
                          setSectorSearch(sector.name);
                          setShowSectorDropdown(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 transition-colors ${
                          equipmentForm.sectorId === sector.id
                            ? "bg-indigo-100 text-indigo-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {sector.name}
                      </div>
                    ))}
                  </div>
                )}
                {showSectorDropdown &&
                  filteredSectors.length === 0 &&
                  sectorSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No se encontraron sectores
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {isEditingEquipment ? "Actualizar Equipo" : "Agregar Equipo"}
              </button>
              {isEditingEquipment && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingEquipment(null);
                    setEquipmentForm({
                      name: "",
                      anydeskNumber: "",
                      computerType: "",
                      connectionType: "",
                      connectionDetails: "",
                      sectorId: "",
                    });
                    setSectorSearch("");
                    setShowSectorDropdown(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
          <DataTable
            columns={equipmentColumns}
            data={equipment}
            pagination
            customStyles={customStyles}
            progressPending={loading}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EquipmentManagement;

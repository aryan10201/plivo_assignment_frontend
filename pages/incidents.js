// pages/incidents.js
import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import DropdownMenu from '../components/ui/DropdownMenu';
import UpdateIncidentModal from '../components/incidents/UpdateIncidentModal';
import config from '../lib/config';

const incidentStatusConfig = {
  investigating: {
    color: 'bg-yellow-500',
    label: 'Investigating',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  },
  identified: {
    color: 'bg-orange-500',
    label: 'Identified',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  },
  monitoring: {
    color: 'bg-blue-500',
    label: 'Monitoring',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    )
  },
  resolved: {
    color: 'bg-green-500',
    label: 'Resolved',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  }
};

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [components, setComponents] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Fetch incidents and components on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incidentsRes, componentsRes] = await Promise.all([
          fetch(`${config.api.baseUrl}${config.api.endpoints.incidents}`),
          fetch(`${config.api.baseUrl}${config.api.endpoints.components}`)
        ]);
        const incidentsData = await incidentsRes.json();
        const componentsData = await componentsRes.json();
        setIncidents(incidentsData);
        setComponents(componentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddIncident = useCallback(async (newIncident) => {
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.incidents}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIncident),
      });
      const savedIncident = await response.json();
      setIncidents(prev => [...prev, savedIncident]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating incident:', error);
    }
  }, []);

  const handleUpdateIncident = useCallback(async (incidentId, update) => {
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.incidents}/${incidentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });
      const updatedIncident = await response.json();
      setIncidents(prev => prev.map(incident => 
        incident._id === updatedIncident._id ? updatedIncident : incident
      ));
      setShowUpdateModal(false);
      setSelectedIncident(null);
    } catch (error) {
      console.error('Error updating incident:', error);
    }
  }, []);

  const handleDeleteIncident = useCallback(async (id) => {
    try {
      await fetch(`${config.api.baseUrl}${config.api.endpoints.incidents}/${id}`, {
        method: 'DELETE',
      });
      setIncidents(prev => prev.filter(incident => incident._id !== id));
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Head>
          <title>Incidents | Status Page</title>
        </Head>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
                <p className="mt-1 text-sm text-gray-500">Manage and track service incidents</p>
              </div>
              <button
                onClick={() => {
                  setEditingIncident(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Incident
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {incidents.length > 0 ? (
              <div className="space-y-6">
                {incidents.map((incident) => (
                  <div key={incident._id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{incident.name}</h3>
                        <div className="mt-1 flex items-center space-x-2">
                          <div className={`${incidentStatusConfig[incident.status].color} p-1 rounded-full`}>
                            {incidentStatusConfig[incident.status].icon}
                          </div>
                          <span className="text-sm text-gray-500">
                            {incidentStatusConfig[incident.status].label}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu
                        options={[
                          { label: 'Add Update', value: 'update' },
                          { label: 'Delete', value: 'delete', danger: true }
                        ]}
                        onSelect={(action) => {
                          if (action === 'delete') {
                            if (confirm('Are you sure you want to delete this incident?')) {
                              handleDeleteIncident(incident._id);
                            }
                          } else if (action === 'update') {
                            setSelectedIncident(incident);
                            setShowUpdateModal(true);
                          }
                        }}
                      />
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Affected Components</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {incident.components.map((component) => (
                          <span
                            key={component._id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {component.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Updates</h4>
                      <div className="mt-2 space-y-4">
                        {incident.updates.map((update) => (
                          <div key={update.id} className="flex items-start space-x-3">
                            <div className={`${incidentStatusConfig[update.status].color} p-1 rounded-full flex-shrink-0 mt-1`}>
                              {incidentStatusConfig[update.status].icon}
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{update.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(update.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new incident.</p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setEditingIncident(null);
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Incident
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Incident Modal */}
        {showModal && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    name: formData.get('name'),
                    status: 'investigating',
                    message: formData.get('message'),
                    components: Array.from(formData.getAll('components')).map(id => 
                      components.find(c => c._id === id)
                    ).filter(Boolean),
                    updates: [{
                      status: 'investigating',
                      message: formData.get('message'),
                      createdAt: new Date().toISOString()
                    }]
                  };
                  
                  if (editingIncident) {
                    handleUpdateIncident(editingIncident._id, data);
                  } else {
                    handleAddIncident(data);
                  }
                }}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {editingIncident ? 'Edit Incident' : 'Create New Incident'}
                    </h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Incident Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., API Outage"
                        defaultValue={editingIncident?.name}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Affected Components
                      </label>
                      <div className="space-y-2">
                        {components.map((component) => (
                          <label key={component._id} className="flex items-center">
                            <input
                              type="checkbox"
                              name="components"
                              value={component._id}
                              defaultChecked={editingIncident?.components.some(c => c._id === component._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-900">{component.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Message
                      </label>
                      <textarea
                        name="message"
                        rows="3"
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe the incident..."
                        defaultValue={editingIncident?.message}
                      ></textarea>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {editingIncident ? 'Save Changes' : 'Create Incident'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingIncident(null);
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Update Incident Modal */}
        {showUpdateModal && selectedIncident && (
          <UpdateIncidentModal
            incident={selectedIncident}
            onUpdate={(update) => handleUpdateIncident(selectedIncident._id, update)}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedIncident(null);
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
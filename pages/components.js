// pages/components.js (updated)
import Head from 'next/head';
import { useState, useCallback, useEffect } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import DropdownMenu from '../components/ui/DropdownMenu';
import UptimeChart from '../components/status/UptimeChart';
import config from '../lib/config';

// Component status colors and icons
const statusConfig = {
  operational: {
    color: 'bg-green-500',
    label: 'Operational',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
  },
  degraded_performance: {
    color: 'bg-yellow-500',
    label: 'Degraded Performance',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  },
  partial_outage: {
    color: 'bg-orange-500',
    label: 'Partial Outage',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  },
  major_outage: {
    color: 'bg-red-500',
    label: 'Major Outage',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )
  }
};

export default function Components() {
  const [components, setComponents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showChartFor, setShowChartFor] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  // Function to filter components by tab
  const filteredComponents = components.filter(component => 
    (component.type || 'active') === activeTab
  );

  const handleDeleteComponent = useCallback(async (id) => {
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.components}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete component');
      }

      await response.json();
      setComponents(prev => prev.filter(component => component._id !== id));
      
      // Also clear the chart if it was showing for this component
      if (showChartFor === id) {
        setShowChartFor(null);
      }
    } catch (error) {
      console.error('Error deleting component:', error);
      alert(error.message || 'Failed to delete component. Please try again.');
    }
  }, [showChartFor]);

  // Function to open edit modal
  const openEditModal = useCallback((component) => {
    setEditingComponent(component);
    setShowModal(true);
  }, []);

  // Then define handleMenuSelect that uses it
  const handleMenuSelect = useCallback((option, component) => {
    switch (option) {
      case 'edit':
        openEditModal(component);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this component? This action cannot be undone.')) {
          handleDeleteComponent(component._id);
        }
        break;
      case 'show_chart':
        setShowChartFor(showChartFor === component._id ? null : component._id);
        break;
      default:
        break;
    }
  }, [openEditModal, handleDeleteComponent, showChartFor]);

  const handleAddComponent = useCallback(async (newComponent) => {
    try {
      console.log('Sending component data:', newComponent);
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.components}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComponent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create component');
      }

      const savedComponent = await response.json();
      setComponents(prev => [...prev, savedComponent]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating component:', error);
      alert(error.message || 'Failed to create component. Please try again.');
    }
  }, []);

  const handleUpdateComponent = useCallback(async (componentId, update) => {
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.components}/${componentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update component');
      }

      const updatedComponent = await response.json();
      setComponents(prev => prev.map(component => 
        component._id === updatedComponent._id ? updatedComponent : component
      ));
      setShowModal(false);
      setEditingComponent(null);
    } catch (error) {
      console.error('Error updating component:', error);
      alert(error.message || 'Failed to update component. Please try again.');
    }
  }, []);

  // Fetch components on component mount
  useEffect(() => {
    const fetchAndCreateComponents = async () => {
      try {
        const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.components}`);
        const data = await response.json();
        console.log('Fetched components:', data);
        
        if (data.length === 0) {
          const defaultComponents = [
            {
              name: 'API',
              description: 'Public API endpoints',
              type: 'active',
              status: 'operational'
            },
            {
              name: 'Website',
              description: 'Main company website and web application',
              type: 'active',
              status: 'operational'
            }
          ];

          console.log('Creating default components:', defaultComponents);

          for (const component of defaultComponents) {
            try {
              const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.components}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(component),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to create default component ${component.name}`);
              }

              await response.json();
            } catch (error) {
              console.error(`Error creating default component ${component.name}:`, error);
            }
          }

          // Fetch components again after adding defaults
          const newResponse = await fetch(`${config.api.baseUrl}${config.api.endpoints.components}`);
          const newData = await newResponse.json();
          console.log('Fetched components after creating defaults:', newData);
          setComponents(newData);
        } else {
          console.log('Setting existing components:', data);
          setComponents(data);
        }
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };

    fetchAndCreateComponents();
  }, []);

  // Form submission in the modal
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const componentData = {
      name: formData.get('name'),
      description: formData.get('description') || '',
      type: activeTab,
      status: formData.get('status') || 'operational'
    };

    console.log('Form data:', componentData); // Debug log

    try {
      if (editingComponent) {
        await handleUpdateComponent(editingComponent._id, componentData);
      } else {
        await handleAddComponent(componentData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Failed to save component. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Components | Status Page</title>
        </Head>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Components</h1>
                  <p className="mt-1 text-sm text-gray-500">Manage and monitor your system components</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingComponent(null);
                    setShowModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Component
                </button>
              </div>
            </div>
            
            <div className="border-b border-gray-200">
              <nav className="flex px-6">
                <button 
                  onClick={() => setActiveTab('active')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'active' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Active Components
                </button>
                <button 
                  onClick={() => setActiveTab('third-party')}
                  className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'third-party' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Third-party Services
                </button>
              </nav>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredComponents.length > 0 ? (
                filteredComponents.map((component) => (
                  <div key={component._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <div className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`w-6 h-6 ${statusConfig[component.status].color} rounded-full flex items-center justify-center`}>
                            {statusConfig[component.status].icon}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">{component.name}</h3>
                            <div className="flex items-center space-x-4">
                              <button 
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                onClick={() => alert('Automation settings for ' + component.name)}
                              >
                                Automation
                              </button>
                              <DropdownMenu 
                                options={[
                                  { label: 'Edit', value: 'edit' },
                                  { label: showChartFor === component._id ? 'Hide Chart' : 'Show Chart', value: 'show_chart' },
                                  { label: 'Delete', value: 'delete', danger: true }
                                ]}
                                onSelect={(option) => handleMenuSelect(option, component)}
                              />
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{component.description}</p>
                          <div className="mt-2 flex items-center">
                            <p className="text-sm text-gray-600">{component.uptime}</p>
                            <button 
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowChartFor(showChartFor === component._id ? null : component._id)}
                              aria-label={showChartFor === component._id ? 'Hide uptime chart' : 'Show uptime chart'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {showChartFor === component._id && (
                        <div className="mt-4">
                          <UptimeChart componentId={component._id} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No components</h3>
                  <p className="mt-1 text-sm text-gray-500">Add components to track their operational status.</p>
                  <button
                    onClick={() => {
                      setEditingComponent(null);
                      setShowModal(true);
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add your first component
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Add/Edit Component Modal */}
        {showModal && (
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editingComponent ? 'Edit Component' : 'Add Component'}
                      </h3>
                      
                      <div className="mt-4">
                        <form onSubmit={handleFormSubmit}>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                              Component Name
                            </label>
                            <input
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              id="name"
                              name="name"
                              type="text"
                              placeholder="e.g., API, Database, Website"
                              defaultValue={editingComponent ? editingComponent.name : ''}
                              required
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                              Status
                            </label>
                            <select
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              id="status"
                              name="status"
                              defaultValue={editingComponent ? editingComponent.status : 'operational'}
                            >
                              {Object.entries(statusConfig).map(([value, config]) => (
                                <option key={value} value={value}>
                                  {config.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                              Description
                            </label>
                            <textarea
                              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              id="description"
                              name="description"
                              placeholder="Brief description of the component"
                              defaultValue={editingComponent ? editingComponent.description : ''}
                              rows="3"
                            />
                          </div>
                          
                          <div className="flex items-center justify-end mt-6">
                            <button
                              type="button"
                              className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => {
                                setShowModal(false);
                                setEditingComponent(null);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              {editingComponent ? 'Save Changes' : 'Add Component'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
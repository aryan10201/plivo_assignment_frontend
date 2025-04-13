import Head from 'next/head';
import { useState, useEffect } from 'react';
import config from '../lib/config';

const statusConfig = {
  operational: {
    color: 'bg-green-500',
    label: 'Operational',
    icon: '✓'
  },
  degraded_performance: {
    color: 'bg-yellow-500',
    label: 'Degraded Performance',
    icon: '⚠'
  },
  partial_outage: {
    color: 'bg-orange-500',
    label: 'Partial Outage',
    icon: '⚠'
  },
  major_outage: {
    color: 'bg-red-500',
    label: 'Major Outage',
    icon: '✕'
  },
  resolved: {
    color: 'bg-gray-500',
    label: 'Resolved',
    icon: '✓'
  },
  unknown: {
    color: 'bg-gray-500',
    label: 'Unknown',
    icon: '?'
  }
};

const getStatusConfig = (status) => {
  return statusConfig[status] || statusConfig.unknown;
};

export default function StatusPage() {
  const [incidents, setIncidents] = useState([]);
  const [components, setComponents] = useState([]);
  
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

  // Calculate statistics
  const totalIncidents = incidents.length;
  const activeIncidents = incidents.filter(incident => incident.status !== 'resolved').length;
  const affectedComponents = components.filter(component => 
    component.status !== 'operational'
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>System Status</title>
      </Head>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">System Status</h1>
          <p className="mt-2 text-gray-600">Last updated: {new Date().toLocaleString()}</p>
        </div>

        {/* Service Status Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map(component => (
              <div key={component._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{component.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getStatusConfig(component.status).color
                  } text-white`}>
                    {getStatusConfig(component.status).label}
                  </span>
                </div>
                {component.description && (
                  <p className="mt-2 text-sm text-gray-600">{component.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Incidents</h2>
          {activeIncidents > 0 ? (
            <div className="space-y-4">
              {incidents
                .filter(incident => incident.status !== 'resolved')
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((incident) => (
                  <div key={incident._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{incident.name}</h3>
                        <p className="text-sm text-gray-500">
                          Started: {new Date(incident.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getStatusConfig(incident.status).color
                      } text-white`}>
                        {getStatusConfig(incident.status).label}
                      </span>
                    </div>
                    {incident.updates && incident.updates.length > 0 && (
                      <p className="mt-2 text-gray-700">
                        {incident.updates[incident.updates.length - 1].message}
                      </p>
                    )}
                  </div>
                ))
              }
            </div>
          ) : (
            <p className="text-gray-500">No active incidents</p>
          )}
        </div>

        {/* Timeline of Recent Incidents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Incidents Timeline</h2>
          <div className="space-y-4">
            {incidents
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 10)
              .map((incident) => (
                <div key={incident._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{incident.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(incident.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusConfig(incident.status).color
                    } text-white`}>
                      {getStatusConfig(incident.status).label}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    {incident.updates && incident.updates.length > 0 
                      ? incident.updates[incident.updates.length - 1].message 
                      : 'No updates available'}
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
} 
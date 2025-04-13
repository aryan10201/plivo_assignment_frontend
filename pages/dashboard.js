// pages/dashboard.js
import Head from 'next/head';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../lib/auth';
import { useState, useEffect } from 'react';
import config from '../lib/config';

export default function Dashboard() {
  const { user } = useAuth();
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
  const totalComponents = components.length;
  const operationalComponents = components.filter(component => component.status === 'operational').length;
  
  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>Dashboard | My Next.js App</title>
        </Head>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          
          {user && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Welcome, {user.name}!</h2>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          )}
          
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Incidents Statistics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Incidents Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Total Incidents</p>
                  <p className="text-2xl font-bold">{totalIncidents}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Active Incidents</p>
                  <p className="text-2xl font-bold">{activeIncidents}</p>
                </div>
              </div>
            </div>

            {/* Components Statistics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Components Overview</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Total Components</p>
                  <p className="text-2xl font-bold">{totalComponents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Recent Updates</h3>
            {incidents.length > 0 ? (
              <div className="space-y-4">
                {incidents
                  .flatMap(incident => 
                    incident.updates.map(update => ({
                      ...update,
                      incidentName: incident.name,
                      incidentId: incident._id
                    }))
                  )
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((update, index) => (
                    <div key={`${update.incidentId}-${update.createdAt}`} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{update.incidentName}</h4>
                          <p className="text-sm text-gray-600">{update.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(update.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          update.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          update.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                          update.status === 'identified' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">No incident updates</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
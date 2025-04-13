// pages/subscribers.js
import Head from 'next/head';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function Subscribers() {
  return (
    <ProtectedRoute>
      <div>
        <Head>
          <title>Subscribers | Status Page</title>
        </Head>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Subscribers</h1>
          <p>Manage your status page subscribers who receive incident notifications.</p>
          
          <div className="mt-6">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add Subscriber
            </button>
          </div>
          
          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
              <p className="text-gray-700 font-semibold">No subscribers yet.</p>
              <p className="text-gray-600 mt-2">
                When you add subscribers, they will be notified about incidents and updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
// components/layout/MainLayout.jsx
import { useAuth } from '../../lib/auth';
import Navbar from './Navbar';
import Sidebar from './sidebar';

export default function MainLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, only show navbar and content (no sidebar)
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
      </div>
    );
  }

  // For authenticated users, show sidebar layout
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
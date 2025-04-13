// components/layout/Navbar.jsx
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import LogoutButton from '../auth/LogoutButton';

export default function Navbar() {
  const { user, isAuthenticated, loading } = useAuth();
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          My App
        </Link>
        
        <div className="space-x-4">
          {loading ? (
            <span>Loading...</span>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.name}</span>
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <LogoutButton className="text-sm py-1 px-2" />
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
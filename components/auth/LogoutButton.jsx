// components/auth/LogoutButton.jsx
import { useAuth } from '../../lib/auth';

export default function LogoutButton({ className }) {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
    >
      Logout
    </button>
  );
}
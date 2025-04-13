// pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../lib/auth';
import MainLayout from '../components/layout/MainLayout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AuthProvider>
  );
}

export default MyApp;

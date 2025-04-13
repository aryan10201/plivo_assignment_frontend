// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../lib/auth';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  
  return (
    <div>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="A Next.js application with authentication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to My App</h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          A secure application built with Next.js and MongoDB
        </p>
        
        {!loading && (
          <div className="space-x-4">
            {isAuthenticated ? (
              <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
                  Login
                </Link>
                <Link href="/register" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
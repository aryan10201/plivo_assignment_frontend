// pages/login.js
import Head from 'next/head';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <div>
      <Head>
        <title>Login | My Next.js App</title>
      </Head>
      <LoginForm />
    </div>
  );
}
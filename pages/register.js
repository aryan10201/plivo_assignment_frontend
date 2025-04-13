// pages/register.js
import Head from 'next/head';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
  return (
    <div>
      <Head>
        <title>Register | My Next.js App</title>
      </Head>
      <RegisterForm />
    </div>
  );
}
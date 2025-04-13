const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://plivo-assignment-backend.vercel.app',
    endpoints: {
      components: '/api/components',
      incidents: '/api/incidents',
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout',
        user: '/api/auth/user'
      }
    }
  },
  mongodb: {
    uri: process.env.NEXT_PUBLIC_MONGODB_URI,
    db: process.env.NEXT_PUBLIC_MONGODB_DB
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET
  }
};

export default config; 
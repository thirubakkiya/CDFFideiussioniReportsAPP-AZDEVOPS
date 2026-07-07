/**
 * Production Environment Configuration
 * 
 * Production environment with backend at relative path
 */
export const productionConfig = {
  environment: 'production',
  apiUrl: process.env.REACT_APP_API_URL_PRODUCTION || '/api',
  debug: false,
  logLevel: 'error',
  timeout: 15000, // 15 seconds for production
  description: 'Production Environment',
};

/**
 * Development Environment Configuration
 * 
 * Local development with backend running at http://localhost:8088
 */
export const developmentConfig = {
  environment: 'development',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8088/api',
  debug: true,
  logLevel: 'debug',
  timeout: 30000, // 30 seconds for local testing
  description: 'Local Development - Backend at localhost:8088',
};

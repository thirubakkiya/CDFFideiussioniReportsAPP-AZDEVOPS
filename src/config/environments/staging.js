/**
 * Staging Environment Configuration (Pre-Production)
 * 
 * Staging/PreProd environment for testing before production deployment
 */
export const stagingConfig = {
  environment: 'staging',
  apiUrl: process.env.REACT_APP_API_URL_STAGING || 'https://staging-api.sella.it/cdf-reports/api',
  debug: true,
  logLevel: 'info',
  timeout: 20000, // 20 seconds for staging
  description: 'Staging (Pre-Production) Environment',
};

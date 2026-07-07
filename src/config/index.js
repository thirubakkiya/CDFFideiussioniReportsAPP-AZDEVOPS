/**
 * Configuration Manager
 * 
 * Determines environment based on NODE_ENV or REACT_APP_ENV
 * and returns the appropriate configuration
 */

import { developmentConfig } from './environments/development';
import { stagingConfig } from './environments/staging';
import { productionConfig } from './environments/production';

/**
 * Get current environment from NODE_ENV or REACT_APP_ENV
 * @returns {string} Environment name: 'development', 'staging', or 'production'
 */
const getEnvironment = () => {
  // Check REACT_APP_ENV first (for explicit override)
  if (process.env.REACT_APP_ENV) {
    return process.env.REACT_APP_ENV.toLowerCase();
  }
  
  // Then check NODE_ENV
  if (process.env.NODE_ENV) {
    const env = process.env.NODE_ENV.toLowerCase();
    // Map NODE_ENV values to our environment names
    if (env === 'development') return 'development';
    if (env === 'staging' || env === 'pre' || env === 'preproduction') return 'staging';
    if (env === 'production') return 'production';
  }
  
  // Default to development
  return 'development';
};

/**
 * Get configuration object for current environment
 * @returns {Object} Configuration with apiUrl, debug, logLevel, etc.
 */
const getConfig = () => {
  const env = getEnvironment();
  
  let config;
  switch (env) {
    case 'staging':
    case 'pre':
      config = stagingConfig;
      break;
    case 'production':
    case 'pro':
      config = productionConfig;
      break;
    case 'development':
    default:
      config = developmentConfig;
  }
  
  // Log configuration on initialization
  if (typeof window !== 'undefined') {
    console.log(
      `%c?? Configuration Loaded: ${config.description}`,
      'color: #4CAF50; font-weight: bold; font-size: 14px;'
    );
    if (config.debug) {
      console.log('Configuration Details:', config);
    }
  }
  
  return config;
};

// Get config once and export as singleton
const config = getConfig();

export default config;

/**
 * Usage Example:
 * 
 * import config from './config';
 * 
 * const client = axios.create({
 *   baseURL: config.apiUrl,
 *   timeout: config.timeout,
 * });
 * 
 * if (config.debug) {
 *   console.log('Debug mode enabled');
 * }
 */

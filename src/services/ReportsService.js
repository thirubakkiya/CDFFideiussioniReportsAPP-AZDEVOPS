import axios from 'axios';
import config from '../config';

/**
 * Reports Service
 * 
 * Centralized API client for all report endpoints
 * API Configuration is loaded from src/config/index.js based on environment
 * 
 * Endpoints:
 * - POST /reports/spese-notaio - Get Spese Notaio Report
 * - POST /reports/tabulato-risconti - Get Tabulato Risconti Report
 * - POST /reports/contabile - Get Controllo Saldi Report
 * - POST /reports/operazioni-contabile - Get Operazioni Contabile Report
 */

const API_BASE_URL = config.apiUrl;

console.log(`?? Reports Service initialized with API URL: ${API_BASE_URL} (${config.environment})`);
if (config.debug) {
  console.log('   Debug logging enabled');
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const RESPONSE_ARRAY_KEYS = [
  'response_data',
  'data',
  'items',
  'results',
  'content',
  'rows',
  'list',
  'payload',
  'reportData',
  'records',
];

const extractArrayFromResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  for (const key of RESPONSE_ARRAY_KEYS) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  for (const key of RESPONSE_ARRAY_KEYS) {
    const nested = payload[key];
    if (nested && typeof nested === 'object') {
      const nestedArray = extractArrayFromResponse(nested);
      if (nestedArray.length > 0) {
        return nestedArray;
      }
    }
  }

  return [];
};

// Add interceptor to include auth token
client.interceptors.request.use((config_obj) => {
  const token = localStorage.getItem('user_access_token');
  if (token) {
    config_obj.headers.Authorization = `Bearer ${token}`;
  }
  
  if (config.debug) {
    console.log(`?? API Request: ${config_obj.method.toUpperCase()} ${config_obj.baseURL}${config_obj.url}`);
    console.log('   Headers:', config_obj.headers);
    if (config_obj.data) {
      console.log('   Body:', config_obj.data);
    }
  }
  
  return config_obj;
});

// Response interceptor to handle errors
client.interceptors.response.use(
  (response) => {
    if (config.debug) {
      console.log(`?? API Response: ${response.status} from ${response.config.url}`);
      console.log('   Data:', response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`? API Error Status: ${error.response.status} from ${error.config.url}`);
      console.error('   Error Data:', error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 400) {
        throw new Error('Invalid request parameters - Please check your input');
      } else if (error.response.status === 401) {
        throw new Error('Unauthorized - Please login again');
      } else if (error.response.status === 403) {
        throw new Error('Access denied - Insufficient permissions');
      } else if (error.response.status === 404) {
        throw new Error('API endpoint not found - Check configuration');
      } else if (error.response.status === 500) {
        throw new Error('Server error - Please try again later');
      }
    } else if (error.request) {
      console.error('? No response received:', error.request);
      console.error('   This usually means the API server is unreachable');
      throw new Error(`Cannot connect to API server at ${API_BASE_URL}`);
    } else {
      console.error('? Error setting up request:', error.message);
      throw new Error('Request failed: ' + error.message);
    }
  }
);

export const ReportsService = {
  /**
   * Get child params by parent key
   * @param {Object} request - Request parameters
   * @param {string} request.parentKey - Parent key (e.g. TIPO_RISCONTI)
   * @param {string|number} request.idBanca - Bank ID
   * @returns {Promise<Array>} Array of child param items
   */
  getChildParams: async ({ parentKey, idBanca }) => {
    try {
      console.log('?? Fetching child params...', { parentKey, idBanca });
      const response = await client.get('/child-params', {
        params: {
          parentKey,
          idBanca,
        },
      });

      const rows = extractArrayFromResponse(response.data);
      console.log(`? Retrieved ${rows.length} child param records`);
      if (rows.length === 0) {
        console.warn('?? Unexpected child params response format:', response.data);
      }
      return rows;
    } catch (error) {
      console.error('? Error fetching child params:', error.message);
      throw error;
    }
  },

  /**
   * Get Spese Notaio Report
   * @param {Object} request - Request parameters
   * @param {string|number} request.bancaId - Bank ID
   * @param {string} request.fromDate - Start date (YYYY-MM-DD)
   * @param {string} request.toDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of Reports objects
   */
  getSpeseNotaioReport: async (request) => {
    try {
      console.log('?? Fetching Spese Notaio Report...', request);
      const response = await client.post('/reports/spese-notaio', request);

      const rows = extractArrayFromResponse(response.data);
      console.log(`? Retrieved ${rows.length} Spese Notaio records`);
      if (rows.length === 0) {
        console.warn('?? Unexpected response format:', response.data);
      }
      return rows;
    } catch (error) {
      console.error('? Error fetching Spese Notaio report:', error.message);
      throw error;
    }
  },

  /**
   * Get Tabulato Risconti Report
   * @param {Object} request - Request parameters
   * @param {string|number} request.bancaId - Bank ID
   * @param {string} request.dataRisconto - Risconti date (YYYY-MM-DD)
   * @param {string} request.tipoRisconti - Type of Risconti
   * @returns {Promise<Array>} Array of TabulatoRiscontiReport objects
   */
  getTabulatoRiscontiReport: async (request) => {
    try {
      console.log('?? Fetching Tabulato Risconti Report...', request);
      const response = await client.post('/reports/tabulato-risconti', request);

      const rows = extractArrayFromResponse(response.data);
      console.log(`? Retrieved ${rows.length} Tabulato Risconti records`);
      if (rows.length === 0) {
        console.warn('?? Unexpected response format:', response.data);
      }
      return rows;
    } catch (error) {
      console.error('? Error fetching Tabulato Risconti report:', error.message);
      throw error;
    }
  },

  /**
   * Get Controllo Saldi Report
   * @param {Object} request - Request parameters
   * @param {string|number} request.bancaId - Bank ID
   * @param {string} request.contoAddebito - Account to debit
   * @param {string} request.executionDate - Execution date (YYYY-MM-DD)
   * @param {string} request.stato - Status filter
   * @returns {Promise<Array>} Array of ReportContabile objects
   */
  getReportContabile: async (request) => {
    try {
      console.log('?? Fetching Controllo Saldi Report...', request);
      const response = await client.post('/reports/controllo-saldi', request);

      const rows = extractArrayFromResponse(response.data);
      console.log(`? Retrieved ${rows.length} Controllo Saldi records`);
      if (rows.length === 0) {
        console.warn('?? Unexpected response format:', response.data);
      }
      return rows;
    } catch (error) {
      console.error('? Error fetching Controllo Saldi report:', error.message);
      throw error;
    }
  },

  /**
   * Get Operazioni Contabile Report
   * @param {Object} request - Request parameters
   * @param {string|number} request.bancaId - Bank ID
   * @param {string} request.contoAddebito - Account to debit
   * @param {string} request.executionDate - Execution date (YYYY-MM-DD)
   * @param {string} request.stato - Operation type (ADDEBITO, ACCREDITO, RETTIFICA)
   * @returns {Promise<Array>} Array of ReportContabile objects
   */
  getOperazioniContabileReport: async (request) => {
    try {
      console.log('?? Fetching Operazioni Contabile Report...', request);
      const response = await client.post('/reports/operazioni-contabile', request);

      const rows = extractArrayFromResponse(response.data);
      console.log(`? Retrieved ${rows.length} Operazioni Contabile records`);
      if (rows.length === 0) {
        console.warn('?? Unexpected response format:', response.data);
      }
      return rows;
    } catch (error) {
      console.error('? Error fetching Operazioni Contabile report:', error.message);
      throw error;
    }
  },

  /**
   * Get Controllo Saldi Report (with pagination support)
   * @param {Object} request - Request body parameters
   * @param {string|number} request.bancaId - Bank ID (required)
   * @param {string} request.executionDate - Execution date (dd/MM/yyyy format, required)
   * @param {string} request.tipoControllo - (Optional) Control type filter
   * @param {number} request.pageNumber - (Optional) Page number (0-indexed, default 0)
   * @param {number} request.pageSize - (Optional) Page size (default 500, max 5000)
   * @returns {Promise<Object>} Paginated response with data[], totalCount, pageNumber, pageSize, totalPages
   */
  getControlloSaldi: async (request) => {
    try {
      console.log('?? Fetching Controllo Saldi Report (paginated via POST)...', request);
      
      const response = await client.post('/reports/controllo-saldi', {
        bancaId: request.bancaId,
        executionDate: request.executionDate,
        tipoControllo: request.tipoControllo || null,
        pageNumber: request.pageNumber || 0,
        pageSize: request.pageSize || 500,
      });
      
      // Response should be PaginatedResponseDto<ControlloSaldiResponse>
      const paginatedData = response.data;
      console.log(`? Retrieved ${paginatedData.data?.length || 0} records of ${paginatedData.totalCount || 0} total`);
      
      return paginatedData;
    } catch (error) {
      console.error('? Error fetching Controllo Saldi report:', error.message);
      throw error;
    }
  },
};

export default ReportsService;

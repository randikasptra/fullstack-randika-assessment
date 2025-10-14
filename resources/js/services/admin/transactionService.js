// resources/js/services/admin/transactionService.js


import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No auth token found');
    }
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
    };
};

const API_URL = `${API_BASE_URL}/api/admin/transactions`;

const TransactionService = {
    // Get transaction history with filters
    getTransactions: async (params = {}) => {
        try {
            const response = await axios.get(API_URL, {
                params,
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error('Transaction history error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Export transaction history to CSV
    exportTransactions: async (params = {}) => {
        try {
            const response = await axios.get(`${API_URL}/export`, {
                params,
                headers: getAuthHeaders(),
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            console.error('Export transactions error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default TransactionService;

// resources/js/services/admin/transactionService.js
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
    };
};

const API_URL = `${API_BASE_URL}/api/admin/transactions`;

const transactionService = {
    // Get all transactions
    getTransactions: async () => {
        try {
            const response = await axios.get(API_URL, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Transactions error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Get transaction detail
    getTransactionDetail: async (transactionId) => {
        try {
            const response = await axios.get(`${API_URL}/${transactionId}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Transaction detail error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },
};

export default transactionService;

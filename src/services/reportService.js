import axios from 'axios';

import { ENDPOINTS } from '../config';

const API_URL = ENDPOINTS.REPORTS;

// Get report statistics
export const getReportStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Generate report (increment counter only)
export const generateReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Download report (get Excel file)
export const downloadReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_URL}/download`, reportData, {
      responseType: 'blob'
    });
    
    // Get filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'attendance_report.xlsx';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    throw error.response?.data || error;
  }
};

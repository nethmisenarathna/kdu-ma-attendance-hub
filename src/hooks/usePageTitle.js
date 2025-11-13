import { useEffect } from 'react';

/**
 * Custom hook to set the document title
 * @param {string} title - The title to set for the page
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - KDU MA Attendance Hub` : 'KDU MA Attendance Hub';
    
    // Cleanup: restore previous title when component unmounts
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

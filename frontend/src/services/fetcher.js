import { getUserToken } from '../utility/utils';
import { Navigate } from 'react-router-dom';

export const fetcher = async ({ resource }) => {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}${resource}`, {
        headers: {
            Authorization: `Bearer ${getUserToken()}`,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    }

    return await response.json();
};

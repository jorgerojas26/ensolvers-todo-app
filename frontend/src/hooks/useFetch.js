import { useState } from 'react';

import { getUserToken } from '../utility/utils';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const useFetch = () => {
    const [errorStatus, setErrorStatus] = useState(null);

    const fetchData = async (resource) => {
        const response = await fetch(`${SERVER_URL}${resource}`, {
            headers: {
                Authorization: `Bearer ${getUserToken()}`,
            },
        });

        if (response.status === 401) return setErrorStatus(401);

        return response.json();
    };

    return { fetchData, errorStatus };
};

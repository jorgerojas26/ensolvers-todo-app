const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const signin = async (userData) => {
    const response = await fetch(`${SERVER_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    return { status: response.status, data };
};

export const signup = async (userData) => {
    const response = await fetch(`${SERVER_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    return { status: response.status, data };
};

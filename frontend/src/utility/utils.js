export const isUserAuthenticated = () => {
    const token = localStorage.getItem('token');

    return token !== null && token !== undefined && token !== '' && token !== 'undefined';
};

export const getUserToken = () => {
    return localStorage.getItem('token');
};

export const removeUserSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
};

import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Signin from './views/Signin';
import Signup from './views/Signup';
import Home from './views/Home';

import { SWRConfig } from 'swr';

import { isUserAuthenticated, removeUserSession } from './utility/utils';
import { useFetch } from './hooks/useFetch';

const PrivateRoute = ({ element: Component, ...rest }) =>
    isUserAuthenticated() ? <Component {...rest} /> : <Navigate to='/signin' />;

function App() {
    const navigate = useNavigate();
    const { fetchData, errorStatus } = useFetch();

    useEffect(() => {
        if (errorStatus === 401) {
            removeUserSession();
            navigate('/signin');
        }
    }, [errorStatus]);

    return (
        <SWRConfig value={{ fetcher: fetchData }}>
            <Routes>
                <Route path='/' element={isUserAuthenticated() ? <Navigate to='home' /> : <Navigate to='signin' />} />

                <Route exact path='signin' element={isUserAuthenticated() ? <Navigate to='/home' /> : <Signin />} />
                <Route exact path='signup' element={isUserAuthenticated() ? <Navigate to='/home' /> : <Signup />} />

                <Route exact path='home' element={<PrivateRoute element={Home} />} />
            </Routes>
        </SWRConfig>
    );
}

export default App;

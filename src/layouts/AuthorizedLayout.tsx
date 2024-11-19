import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import {Outlet, useNavigate} from 'react-router-dom';
import {useEffect} from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
function AuthorizedLayout() {
    const isAuthenticated = useIsAuthenticated()
    const auth = useAuthUser()
    const navigate = useNavigate();

    //todo check why isauthenticated always returns false (maybe try @auth-kit/react-router)
    useEffect(() => {
        console.log('isAuthenticated', isAuthenticated)
        console.log('auth', auth)
        //if(!isAuthenticated)    navigate('/auth');
    }, [isAuthenticated]);

    return (
        <Outlet />
    );
}

export default AuthorizedLayout;
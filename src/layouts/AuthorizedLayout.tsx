import {Outlet, useNavigate} from 'react-router-dom';
import {useAppStore} from "../store.ts";
import {useEffect} from "react";
function AuthorizedLayout() {
    const navigate = useNavigate();
    const authData = useAppStore((state) => state.authData);

    useEffect(() => {
        if(!authData) {
            navigate('/auth');
        }
    }, [authData]);

    return (
        <Outlet />
    );
}

export default AuthorizedLayout;
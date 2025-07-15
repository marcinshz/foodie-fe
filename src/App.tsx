import './App.scss'
import {createBrowserRouter, Navigate, RouterProvider,} from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import AuthorizedLayout from "./layouts/AuthorizedLayout.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import SingleDishPage from "./pages/SingleDishPage/SingleDishPage.tsx";

function App() {

    const router = createBrowserRouter([
        {
            path: "/auth",
            element: <AuthPage/>,
        },
        {
            path: "/home",
            element: <AuthorizedLayout/>,
            children: [
                {path: '/home/', element: <HomePage/>},
                {path: '/home/single-dish', element: <SingleDishPage/>}
            ]
        },
        {
            path: "*",
            element: <Navigate to={'/home'}/>
        }
    ]);

    return (
        <>
            <Navbar/>
            <RouterProvider router={router}/>
        </>
    )
}

export default App

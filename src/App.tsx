import './App.scss'
import {createBrowserRouter, Navigate, RouterProvider,} from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import AuthorizedLayout from "./layouts/AuthorizedLayout.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import SingleDishPage from "./pages/SingleDishPage/SingleDishPage.tsx";
import CookBookPage from "./pages/CookBookPage/CookBookPage.tsx";
import {getRecipeById} from "./DataService.ts";

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
                {
                    path: '/home/single-dish', children: [
                        {path: '/home/single-dish', element: <SingleDishPage/>},
                        {
                            path: '/home/single-dish/:id', element: <SingleDishPage/>, loader: async ({params}) => {
                                if (params.id) {
                                    return await getRecipeById(params.id);
                                }
                            }
                        },
                    ]
                },
                {path: '/home/cookbook', element: <CookBookPage/>},
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

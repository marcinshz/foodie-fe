import './App.scss'
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import AuthProvider from 'react-auth-kit';
import {store} from "./auth.ts";
import AuthorizedLayout from "./layouts/AuthorizedLayout.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

function App() {

    const router = createBrowserRouter([
        {
            path: "/auth",
            element: <AuthPage/>,
        },
        {
            path: "/authorized",
            element: <AuthorizedLayout/>,
            children: [
                {path: '/authorized/', element: <HomePage/>}
            ]
        },
        {
            path:"*",
            element: <Navigate to={'/authorized'}/>
        }
    ]);

  return (
      <AuthProvider store={store}>
        <Navbar/>
        <RouterProvider router={router} />
      </AuthProvider>
  )
}

export default App

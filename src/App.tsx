import './App.scss'
import {
    createBrowserRouter,
    RouterProvider,
    Link, Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import AuthProvider from 'react-auth-kit';
import {store} from "./auth.ts";
import AuthorizedLayout from "./layouts/AuthorizedLayout.tsx";

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
                {path: '/authorized/', element: <div>home</div>}
            ]
        },
        {
            path:"*",
            element: <Navigate to={'/authorized'}/>
        }
    ]);

  return (
      <AuthProvider store={store}>
        <RouterProvider router={router} />
      </AuthProvider>
  )
}

export default App

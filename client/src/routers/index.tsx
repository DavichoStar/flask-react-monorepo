import { createBrowserRouter } from "react-router-dom";

import Products from "../screens/Products";
import Layout from "../components/Layout";
import Login from "../screens/Login";
import About from "../screens/About";

//? Crear el enrutador de todas las pantallas
const routers = createBrowserRouter([
  //! Página para iniciar sesión
  {
    index: true,
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />, //? Layout es el componente que contiene el menú
    children: [
      //! Página para ver la información "Acerca de"
      {
        path: "about",
        element: <About />,
      },
      //! Página para ver los productos
      {
        path: "products",
        element: <Products />,
      },
    ],
  },
]);

export default routers;

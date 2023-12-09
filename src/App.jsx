import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import LayoutWrapper from "./components/LayoutWrapper";
import HomePage from "./pages/HomePage";
import GraphicPage from "./pages/GraphicPage";
import AccessPage from "./pages/AccessPage";
import TablePage from "./pages/TablePage";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWrapper />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "table",
        element: <TablePage />,
      },
      {
        path: "graphic",
        element: <GraphicPage />,
      },
    ],
  },
  {
    path: "/access",
    element: <AccessPage />,
  },
]);

export default function App() {
  const navigate = useNavigate();

  return (
    <>
      <NextUIProvider navigate={navigate}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
        <RouterProvider router={router} />
        </NextThemesProvider>
      </NextUIProvider>
    </>
  );
}

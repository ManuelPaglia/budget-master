import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import LayoutWrapper from "./components/LayoutWrapper";
import AccessPage from "./pages/AccessPage";
import HomePage from "./pages/HomePage";
import TablePage from "./pages/TablePage";
import GraphicPage from "./pages/GraphicPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  {
    path: "/",
    element: <Navigate to="/access" />,
  },
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>
);

reportWebVitals();

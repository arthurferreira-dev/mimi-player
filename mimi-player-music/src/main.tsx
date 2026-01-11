import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Router";
import './App.scss';
import "./base.css";

createRoot(document.querySelector("body")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
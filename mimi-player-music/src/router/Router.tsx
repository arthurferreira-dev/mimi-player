import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import type { Routing } from "../types/Types";

const routing: Routing[] = [
  {
    path: "/",
    element: <App />,
  },
];

export const router = createBrowserRouter(routing);
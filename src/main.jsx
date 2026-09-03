import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./routes/Routes.jsx";
import { RouterProvider } from "react-router";
import AuthProvider from "./providers/AuthProvider.jsx";
import { APIProvider } from "@vis.gl/react-google-maps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { googleMapApiKey } from "./utils/googleApiKey.js";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <APIProvider apiKey={googleMapApiKey}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </APIProvider>
  </QueryClientProvider>,
);

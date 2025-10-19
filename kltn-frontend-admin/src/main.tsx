import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { openDB } from "idb";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15, 
      gcTime: 1000 * 60 * 30, 
    },
  },
});

const dbPromise = openDB("tanstack-query", 1, {
  upgrade(db) {
    db.createObjectStore("keyval");
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    async getItem(key) {
      return (await dbPromise).get("keyval", key);
    },
    async setItem(key, value) {
      return (await dbPromise).put("keyval", value, key);
    },
    async removeItem(key) {
      return (await dbPromise).delete("keyval", key);
    },
  },
});

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 30, // Giữ cache tối đa 10 phút
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppWrapper>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AppWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  </StrictMode>
);

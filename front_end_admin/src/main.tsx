import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";

import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store.tsx";
import Message from "./components/ui/message/Message.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <AppWrapper>
          <App />
          <Message/>
        </AppWrapper>
        <Toaster
          toastOptions={{
            duration: 3000,
            style: {
              zIndex: 10000,
            },
          }}
        />
      </Provider>

    </ThemeProvider>

  </StrictMode>,
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defaultSystem,
} from "@chakra-ui/react";
// import { Provider } from "@/components/ui/provider"
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/inter";

export const system = createSystem(defaultConfig, {
  theme: {
    colors: {
      brand: {
        50: "#e6f7ec",
        100: "#c0e6cf",
        200: "#97d6b0",
        300: "#6dc690",
        400: "#45b671",
        500: "#159638",
        600: "#128d32",
        700: "#0f7730",
        800: "#0c612d",
        900: "#084b28",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom/client";
import GooglePay from "./BotaoGoogle.jsx";
import { Centraliza } from "./Styles";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <Centraliza>
      <GooglePay />
    </Centraliza>
  </React.StrictMode>
);

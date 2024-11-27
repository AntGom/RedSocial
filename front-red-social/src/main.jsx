import ReactDom from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import TimeAgo from "javascript-time-ago";
import es from "javascript-time-ago/locale/es.json";
import { CountersProvider } from "./context/CountersContext.jsx";

TimeAgo.addDefaultLocale(es);
TimeAgo.addLocale(es);

ReactDom.createRoot(document.getElementById("root")).render(
  <CountersProvider>
    <App />
  </CountersProvider>
);

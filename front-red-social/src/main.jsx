import ReactDom from "react-dom/client";
import App from "./App.jsx";


import "./index.css";

//configuracion react time ago
import TimeAgo from "javascript-time-ago";
import es from "javascript-time-ago/locale/es.json";

TimeAgo.addDefaultLocale(es);
TimeAgo.addLocale(es);



//Arrancar app de react
ReactDom.createRoot(document.getElementById("root")).render(
<App />



);

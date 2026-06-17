import "./buildbyhenri.css";
import { createRoot } from "react-dom/client";
import { BBHApp } from "./BBHApp.jsx";
import { startBg } from "./bg.js";

createRoot(document.getElementById("root")).render(<BBHApp />);
startBg();


import { createRoot } from "react-dom/client";
import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import App from "./App";

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);

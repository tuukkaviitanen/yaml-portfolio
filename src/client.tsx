import { hydrateRoot } from "react-dom/client";
import App from "./App";
import type { PopulatedConfiguration } from "./utils/types";

hydrateRoot(
  document,
  <App configuration={window.configuration as PopulatedConfiguration} />
);

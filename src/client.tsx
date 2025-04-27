import { hydrateRoot } from "react-dom/client";
import App from "./App";
import type { PopulatedConfiguration } from "./utils/configuration";

hydrateRoot(
  document,
  <App configuration={window.configuration as PopulatedConfiguration} />
);

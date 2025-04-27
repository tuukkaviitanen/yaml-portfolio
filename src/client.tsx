import { hydrateRoot } from "react-dom/client";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const configuration = (window as any).configuration;

hydrateRoot(document, <App configuration={configuration} />);

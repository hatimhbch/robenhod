// entry-client.tsx - Client-side entry point for the SolidJS application
// This file is responsible for hydrating the client-side application in the browser

// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

// Mount the SolidJS Start client to the app container element
// This enables client-side hydration and interactivity
mount(() => <StartClient />, document.getElementById("app")!);

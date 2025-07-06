// entry-server.tsx - Server-side entry point for SolidJS Start server-side rendering
// This file defines the HTML document structure and server-side rendering setup

// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

// Export default server handler that renders the application on the server
export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          {/* Essential meta tags for proper rendering */}
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {/* CSS and other assets injected by SolidJS Start */}
          {assets}
        </head>
        <body>
          {/* Main app container where SolidJS components are rendered */}
          <div id="app">{children}</div>
          {/* Client-side JavaScript bundles */}
          {scripts}
        </body>
      </html>
    )}
  />
));

// src/components/PreviewPane.js

import React, { useRef, useEffect } from "react";

const PreviewPane = ({ html, css }) => {
  const srcDocContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
  return (
    <iframe
      title="Preview"
      srcDoc={srcDocContent}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default PreviewPane;

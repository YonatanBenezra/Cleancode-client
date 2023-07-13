import PropTypes from "prop-types";

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

PreviewPane.propTypes = {
  html: PropTypes.string.isRequired,
  css: PropTypes.string.isRequired,
};

export default PreviewPane;

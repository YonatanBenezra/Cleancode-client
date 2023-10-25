import React, { useEffect } from "react";

function AdsPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";

    // Set the Adsterra options
    window.atOptions = {
      key: "c721be1582bda356d78a40848af09f44",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    script.src =
      "//www.highcpmcreativeformat.com/c721be1582bda356d78a40848af09f44/invoke.js";

    document.body.appendChild(script);

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <h2>Adds</h2>
      <div id="adsterra-ad-container"></div>
    </>
  );
}

export default AdsPage;

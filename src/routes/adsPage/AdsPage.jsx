import React, { useEffect, useRef } from "react";

const AdsPage = () => {
  const banner = useRef(HTMLDivElement);

  useEffect(() => {
    if (!banner.current.firstChild) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highcpmcreativeformat.com/c721be1582bda356d78a40848af09f44/invoke.js`;

      if (banner.current) {
        banner.current.append(script);
      }
    }
  }, []);

  return (
    <>
      <h2>Hello</h2>
      <div ref={banner}></div>
      <div id={`c721be1582bda356d78a40848af09f44`}></div>
    </>
  );
};

export default AdsPage;

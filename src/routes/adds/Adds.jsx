import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const Adds = () => {
  useEffect(() => {
    // Define the script settings
    window.atOptions = {
      key: "c721be1582bda356d78a40848af09f44",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    // Create the script element
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src =
      "//www.profitablecreativeformat.com/c721be1582bda356d78a40848af09f44/invoke.js";

    // Append the script to the document
    document.body.appendChild(scriptElement);

    // Cleanup function to remove script on component unmount
    return () => {
      document.body.removeChild(scriptElement);
    };
  }, []);
  return (
    <div>
      <Helmet>
        <script>
          {`
            atOptions = {
              'key' : 'c721be1582bda356d78a40848af09f44',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `}
        </script>
        <script
          src="//www.profitablecreativeformat.com/c721be1582bda356d78a40848af09f44/invoke.js"
          type="text/javascript"
          async
        />
      </Helmet>
      <h2>Banner 300x250</h2>
      <Helmet>
        <script type="text/javascript">
          {`
            window.atOptions = {
              'key': 'fd8325c34a777156da47140c2e12c97a',
              'format': 'iframe',
              'height': 90,
              'width': 728,
              'params': {}
            };
          `}
        </script>
        <script
          src="//www.profitablecreativeformat.com/fd8325c34a777156da47140c2e12c97a/invoke.js"
          type="text/javascript"
          async
        />
      </Helmet>
      <h2>Banner 728x90s</h2>

      <a href="https://www.highcpmrevenuegate.com/p54bknaze0?key=0854886ffb7b9924bd6ffb84d4852168">
        Click For Adds
      </a>
      <h2>Direct Link</h2>

      <Helmet>
        <script
          src="//pl21016369.highcpmrevenuegate.com/b0/0f/3c/b00f3c693785c6f3af9b8cb392af3f6e.js"
          type="text/javascript"
          async
        />
      </Helmet>
      <h2>Social Bar</h2>

      <Helmet>
        <script
          async="async"
          data-cfasync="false"
          src="//pl21004615.highcpmrevenuegate.com/f1a05f63016536eb9941bcfe94f17bae/invoke.js"
          type="text/javascript"
        />
      </Helmet>

      <div id="container-f1a05f63016536eb9941bcfe94f17bae"></div>
      <h2>Native Banner</h2>
    </div>
  );
};

export default Adds;

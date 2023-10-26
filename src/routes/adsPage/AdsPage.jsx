import { useEffect, useRef } from "react";
export default function Banner() {
  const banner = useRef();

  const atOptions = {
    key: "c721be1582bda356d78a40848af09f44",
    format: "iframe",
    height: 250,
    width: 300,
    params: {},
  };
  useEffect(() => {
    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//www.highperformancedformats.com/c721be1582bda356d78a40848af09f44/invoke.js`;
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      banner.current.append(conf);
      banner.current.append(script);
    }
  }, [banner]);

  return (
    <>
      <h2>😠</h2>
      <div
        className="mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center"
        ref={banner}
      ></div>
    </>
  );
}

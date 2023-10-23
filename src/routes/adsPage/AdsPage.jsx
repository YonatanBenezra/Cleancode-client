import { useEffect } from 'react';

function AdsPage() {
  useEffect(() => {
    const scriptElement = document.createElement("script");
    const lastScript = document.scripts[document.scripts.length - 1];
    scriptElement.settings = {};
    scriptElement.src =
      "//alarming-rule.com/bmXZVps.doG/lj0JYnWYdxipY/Ws5NuxZ/XOIq/GevmC9GugZWUelfkbPfTAQD4BOtTxkp5ZMXTVk/ttNXDAgb5UOmTHkJy/MjA-";
    lastScript.parentNode.insertBefore(scriptElement, lastScript);

    // Optional: Cleanup function to remove the script when component unmounts
    return () => {
      scriptElement.remove();
    };
  }, []); // Empty dependency array ensures this runs once when the component mounts and then cleans up when it unmounts

  return null; // This component doesn't render anything visible
}

export default AdsPage;

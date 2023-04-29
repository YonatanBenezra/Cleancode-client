// src/components/ResizableEditors/ResizableEditors.js

import React, { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import PreviewPane from "./previewPane/PreviewPane";
import "./resizable-editors.scss";

const ResizableEditors = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      const editorContainer = document.querySelector(".editor-pane");
      editorContainer.style.height = `${e.clientY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = () => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const resizer = document.querySelector(".resizer");
    resizer.addEventListener("mousedown", handleMouseDown);

    return () => {
      resizer.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div className="ResizableEditors">
      <div className="editor-pane">
        <CodeEditor language="html" code={htmlCode} onChange={setHtmlCode} />
        <div className="resizer"></div>
        <CodeEditor language="css" code={cssCode} onChange={setCssCode} />
      </div>
      <PreviewPane htmlCode={htmlCode} cssCode={cssCode} />
    </div>
  );
};

export default ResizableEditors;

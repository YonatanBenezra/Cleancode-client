import React, { useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Editor from "@monaco-editor/react";
import GlobalContext from "../../contexts/Global-Context";
import { htmlSuggestions, cssSuggestions } from "../../utils/suggestions";
import "./code-editor.scss";

const CodeEditor = ({ selectedLanguage, code, onChange, width, height }) => {
  // useState hooks
  const [value, setValue] = useState(code || "");
  const [editorInstance, setEditorInstance] = useState(null);

  // useContext hooks
  const { isDarkMode } = useContext(GlobalContext);

  // Custom hook
  const ctrlPress = useKeyPress("Control");

  // Constants
  const options = {
    selectOnLineNumbers: true,
    fontSize: 16,
    automaticLayout: true,
    wordBasedSuggestions: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false,
    },
    suggestOnTriggerCharacters: true,
    formatOnType: true,
    formatOnPaste: true,
  };

  // Event Handlers
  const handleEditorChange = (value) => {
    setValue(value);
    onChange(value);
  };

  const handleMouseWheel = useCallback(
    (event, monaco) => {
      if (editorInstance && event.ctrlKey) {
        event.preventDefault();
        const zoomIn = event.deltaY < 0;
        const increment = zoomIn ? 1 : -1;
        const currentFontSize = editorInstance.getOption(
          monaco.editor.EditorOption.fontSize
        );
        const newFontSize = currentFontSize + increment;
        editorInstance.updateOptions({ fontSize: newFontSize });
      }
    },
    [editorInstance]
  );

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);
    editor.focus();
    const suggestions =
      selectedLanguage === "html" ? htmlSuggestions : cssSuggestions;

    monaco.languages.registerCompletionItemProvider(selectedLanguage, {
      provideCompletionItems: () => {
        return {
          suggestions: suggestions.map((suggestion) => ({
            label: suggestion.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: suggestion.snippet,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          })),
        };
      },
    });

    editor
      .getDomNode()
      .addEventListener("wheel", (event) => handleMouseWheel(event, monaco));
  };

  useEffect(() => {
    if (editorInstance) {
      editorInstance
        .getDomNode()
        .addEventListener("wheel", (event) => handleMouseWheel(event, monaco));
    }
    return () => {
      if (editorInstance) {
        editorInstance
          .getDomNode()
          .removeEventListener("wheel", handleMouseWheel);
      }
    };
  }, [editorInstance, ctrlPress, handleMouseWheel]);

  // Component Render
  return (
    <React.Fragment>
      <Editor
        height={height || "50vh"}
        width={width || "100%"}
        language={selectedLanguage}
        value={value}
        theme={isDarkMode ? "vs-dark" : "light"}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={options}
      />
    </React.Fragment>
  );
};

// Custom Hook outside of the component
function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    function downHandler({ key }) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

CodeEditor.propTypes = {
  selectedLanguage: PropTypes.string,
  code: PropTypes.string,
  onChange: PropTypes.func,
  height: PropTypes.string,
  width: PropTypes.string,
};

export default CodeEditor;

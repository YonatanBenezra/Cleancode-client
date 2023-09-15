import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Editor from "@monaco-editor/react";
import GlobalContext from "../../contexts/Global-Context";
import { htmlSuggestions, cssSuggestions } from "../../utils/suggestions";
import "./code-editor.scss";

const CodeEditor = ({ selectedLanguage, code, onChange, width, height }) => {
  const [value, setValue] = useState(code);
  const [editorInstance, setEditorInstance] = useState(null);
  const { isDarkMode } = useContext(GlobalContext);

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

  const handleEditorChange = (value) => {
    setValue(value);
    onChange(value);
  };

  useEffect(() => {
    setValue(code);
  }, [code]);
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
  };

  useEffect(() => {
    if (editorInstance) {
      const handleMouseWheel = (event) => {
        if (event.ctrlKey) {
          event.preventDefault();
          const zoomIn = event.deltaY < 0;
          const increment = zoomIn ? 1 : -1;
          const currentFontSize = editorInstance.getOption(
            monaco.editor.EditorOption.fontSize
          );
          const newFontSize = currentFontSize + increment;
          editorInstance.updateOptions({ fontSize: newFontSize });
        }
      };
      const domNode = editorInstance.getDomNode();
      domNode.addEventListener("wheel", handleMouseWheel);

      return () => {
        domNode.removeEventListener("wheel", handleMouseWheel);
      };
    }
  }, [editorInstance]);

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

CodeEditor.propTypes = {
  selectedLanguage: PropTypes.string,
  code: PropTypes.string,
  onChange: PropTypes.func,
  height: PropTypes.string,
  width: PropTypes.string,
};

export default CodeEditor;

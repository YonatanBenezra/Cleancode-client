import React, { useCallback, useContext, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import GlobalContext from "../../contexts/Global-Context";
import "./code-editor.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import { htmlSuggestions, cssSuggestions } from "../../utils/suggestions";
import PropTypes from "prop-types";

const CodeEditor = ({ selectedLanguage, code, answers, onChange }) => {
  const { topic, exerciseNum } = useParams();
  const { isDarkMode } = useContext(GlobalContext);
  const [value, setValue] = useState(code || "");
  const [submittedAnswer, setSubmittedAnswer] = useState({});
  const [editorInstance, setEditorInstance] = useState(null);
  const ctrlPress = useKeyPress("Control");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange(value);
  };

  function parseInput(input) {
    const lines = input.split("\n");

    const questionLines = [];
    const codeLines = [];

    for (const line of lines) {
      if (line.trim().startsWith("//")) {
        const questionLine = line.replace("//", "").trim();
        questionLines.push(questionLine);
      } else {
        codeLines.push(line);
      }
    }

    const question = questionLines.join("\n");
    const code = codeLines.join("\n");

    return { question, code };
  }
  const handleSubmitValue = async () => {
    /*  if (!parseInput(value).code.trim())
      return setSubmittedAnswer({ isCorrect: false, score: 0 });

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "user",
              content: `Please validate the accuracy of the user's response and provide a response in the specified format: {isCorrect: Boolean, score: Number}. The score indicates the proximity of the user's answer to a range between 0 and 100.
              Question: ${parseInput(value).question}.
              Code: ${parseInput(value).code}.`,
            },
          ],
          max_tokens: 200,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_GPT_KEY}`,
          },
        }
      );

      const result = Function(
        `"use strict"; return (${response.data.choices[0].message.content});`
      )();
      setSubmittedAnswer(result);
    } catch (error) {
      alert("Please try after 30 seconds");
    } */
  };

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);
    editor.focus();
    editor
      .getDomNode()
      .addEventListener("wheel", (event) => handleMouseWheel(event, monaco));
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
  console.log(selectedLanguage);
  return (
    <React.Fragment>
      <div className="app-container">
        <div className="editor-section">
          <h2>{selectedLanguage} Editor</h2>
          <Editor
            height="50vh"
            width="100%"
            language={selectedLanguage}
            value={value}
            theme={isDarkMode ? "vs-dark" : "light"}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={options}
          />
          <button onClick={handleSubmitValue} className="submit-button">
            Run
          </button>
        </div>

        {selectedLanguage === "javascript" && (
          <div className="output-section">
            <h2>Output / Console</h2>
            <div
              className={`message ${
                submittedAnswer.isCorrect !== undefined
                  ? submittedAnswer.isCorrect
                    ? "success"
                    : "error"
                  : ""
              }`}
            >
              {submittedAnswer.isCorrect !== undefined && (
                <span>
                  {submittedAnswer.isCorrect
                    ? "Amazing, great job"
                    : "Wrong answer, but you got this"}
                </span>
              )}
            </div>
            <div className="output-content">
              {submittedAnswer && submittedAnswer.isCorrect !== undefined && (
                <p>
                  Your answer was{" "}
                  <code>{submittedAnswer.isCorrect ? "Correct" : "Wrong"}</code>
                  . Its score is: {submittedAnswer.score}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="navigation-section">
          <a
            className="next-link"
            href={`/${selectedLanguage}/${topic}/${Number(exerciseNum) + 1}`}
          >
            Next Exercise
          </a>
        </div>
      </div>
    </React.Fragment>
  );
};

/* CodeEditor.propTypes = {
  selectedLanguage: PropTypes.string,
  code: PropTypes.string,
  answers: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
}; */
export default CodeEditor;

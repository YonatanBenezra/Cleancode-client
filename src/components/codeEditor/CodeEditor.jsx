import React, { useCallback, useContext, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import GlobalContext from "../../contexts/Global-Context";
import "./code-editor.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import { htmlSuggestions, cssSuggestions } from "../../utils/suggestions";
import PropTypes from "prop-types";

const CodeEditor = ({ selectedLanguage, code, answers, onChange, height }) => {
  const { topic, exerciseNum } = useParams();
  const { isDarkMode } = useContext(GlobalContext);
  const [value, setValue] = useState(code || "");
  const [submittedAnswer, setSubmittedAnswer] = useState({});
  const [editorInstance, setEditorInstance] = useState(null);
  const ctrlPress = useKeyPress("Control");
  const [loading, setLoading] = useState(false);

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
    if (!parseInput(value).code.trim())
      return setSubmittedAnswer({ isCorrect: false, score: 0 });
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "user",
              content: `Ensure you adopt the following structure to assess and provide feedback on the user's response:

              {
              isCorrect: Boolean,
              hints: String,
              badPractices: String,
              bestPractices: String,
              tips: String,
              score: Number
              }.
              
              The score should express how closely the user's response aligns with the desired answer, represented on a scale from 0 to 100. Additionally, consider providing hints that guide the user towards the correct answer, outline any bad practices they may have employed, and propose best practices they should adhere to. Supply tips aimed at improving their overall coding skills. It's critical not to reveal the correct answer within the feedback.

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
    } finally {
      setLoading(false);
    }
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

  return (
    <React.Fragment>
      <Editor
        height={height || "50vh"}
        width={selectedLanguage === "javascript" ? "70%" : "100%"}
        language={selectedLanguage}
        value={value}
        theme={isDarkMode ? "vs-dark" : "light"}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={options}
      />
      {selectedLanguage === "javascript" && (
        <div
          className={`output-window ${
            submittedAnswer.isCorrect !== undefined
              ? submittedAnswer.isCorrect
                ? "success"
                : "error"
              : ""
          }`}
        >
          <div className="btn-msg-container">
            <button
              onClick={handleSubmitValue}
              className="code-editor-submit-button"
              disabled={loading}
            >
              {loading ? "Loading..." : "Run"}
            </button>
            {submittedAnswer.isCorrect !== undefined && (
              <span className="output-message">
                {submittedAnswer.isCorrect
                  ? "Amazing, great job"
                  : submittedAnswer.feedback}
              </span>
            )}
          </div>
          <h3>Output / Console</h3>
          <hr className="horizontal-line" />
          <div className="output-window__content">
            {submittedAnswer && submittedAnswer.isCorrect !== undefined && (
              <div>
                <p>
                  Your answer was{" "}
                  <code>{submittedAnswer.isCorrect ? "Correct" : "Wrong"}</code>
                  . Its score is: {submittedAnswer.score}
                </p>
                {submittedAnswer.hints && <p>Hints: {submittedAnswer.hints}</p>}
                {submittedAnswer.badPractices && (
                  <p>Bad Practices: {submittedAnswer.badPractices}</p>
                )}
                {submittedAnswer.bestPractices && (
                  <p>Best Practices: {submittedAnswer.bestPractices}</p>
                )}
                {submittedAnswer.tips && <p>Tips: {submittedAnswer.tips}</p>}
              </div>
            )}
          </div>
          <a href={`/${selectedLanguage}/${topic}/${Number(exerciseNum) + 1}`}>
            Next Exercise
          </a>
        </div>
      )}
    </React.Fragment>
  );
};

CodeEditor.propTypes = {
  selectedLanguage: PropTypes.string,
  code: PropTypes.string,
  answers: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
};
export default CodeEditor;

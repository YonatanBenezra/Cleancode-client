import React, { useContext, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import GlobalContext from "../../contexts/Global-Context";
import "./code-editor.scss";
import { Link, NavLink, useParams } from "react-router-dom";
import axios from "axios";

const htmlSuggestions = [
  { label: "div", snippet: "<div>$1</div>" },
  { label: "span", snippet: "<span>$1</span>" },
  { label: "p", snippet: "<p>$1</p>" },
  { label: "h1", snippet: "<h1>$1</h1>" },
  { label: "h2", snippet: "<h2>$1</h2>" },
  { label: "h3", snippet: "<h3>$1</h3>" },
  { label: "h4", snippet: "<h4>$1</h4>" },
  { label: "h5", snippet: "<h5>$1</h5>" },
  { label: "h6", snippet: "<h6>$1</h6>" },
  { label: "a", snippet: '<a href="$1">$2</a>' },
  { label: "img", snippet: '<img src="$1" alt="$2">' },
  { label: "ul", snippet: "<ul>\n\t<li>$1</li>\n</ul>" },
  { label: "ol", snippet: "<ol>\n\t<li>$1</li>\n</ol>" },
  { label: "li", snippet: "<li>$1</li>" },
  {
    label: "table",
    snippet: "<table>\n\t<tr>\n\t\t<td>$1</td>\n\t</tr>\n</table>",
  },
  { label: "tr", snippet: "<tr>\n\t<td>$1</td>\n</tr>" },
  { label: "td", snippet: "<td>$1</td>" },
];

const cssSuggestions = [
  { label: "width", snippet: "width: $1;" },
  { label: "height", snippet: "height: $1;" },
  { label: "background-color", snippet: "background-color: $1;" },
  { label: "color", snippet: "color: $1;" },
  { label: "font-size", snippet: "font-size: $1;" },
  { label: "font-weight", snippet: "font-weight: $1;" },
  { label: "text-align", snippet: "text-align: $1;" },
  { label: "border", snippet: "border: $1;" },
  { label: "padding", snippet: "padding: $1;" },
  { label: "margin", snippet: "margin: $1;" },
  { label: "display", snippet: "display: $1;" },
  { label: "flex-direction", snippet: "flex-direction: $1;" },
  { label: "justify-content", snippet: "justify-content: $1;" },
  { label: "align-items", snippet: "align-items: $1;" },
  { label: "position", snippet: "position: $1;" },
  { label: "top", snippet: "top: $1;" },
  { label: "right", snippet: "right: $1;" },
  { label: "bottom", snippet: "bottom: $1;" },
  { label: "left", snippet: "left: $1;" },
  { label: "z-index", snippet: "z-index: $1;" },
  { label: "opacity", snippet: "opacity: $1;" },
  { label: "border-radius", snippet: "border-radius: $1;" },
  { label: "transition", snippet: "transition: $1;" },
];
const CodeEditor = ({ selectedLanguage, code, answers, onChange }) => {
  const { language, topic, exerciseNum } = useParams();
  const { isDarkMode } = useContext(GlobalContext);
  const [value, setValue] = useState(code || "");
  const [submittedValue, setSubmittedValue] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const handleEditorChange = (value) => {
    setValue(value);
    onChange(value);
  };

  function parseInput(input) {
    const lines = input.split("\n");

    let questionLines = [];
    let codeLines = [];

    for (let line of lines) {
      if (line.trim().startsWith("//")) {
        // This is a line of the question
        questionLines.push(line.replace("//", "").trim());
      } else {
        // This is a line of the code
        codeLines.push(line);
      }
    }

    // Join the lines without adding a newline at the end
    let question = questionLines.join("\n");
    let code = codeLines.join("\n");

    return { question, code };
  }
  const handleSubmitValue = async () => {
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
          max_tokens: 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
        }
      );

      const ans = Function(
        `"use strict"; return (${response.data.choices[0].message.content});`
      )();
      alert(
        `Your answer is ${
          ans.isCorrect ? "correct" : "incorrect"
        } with a score of ${ans.score}`
      );
      // setSubmittedAnswer(ans);
      /* answers.map(
        (answer) =>
          value
            .toString()
            .replace(/\n/g, "")
            .replace(/ /g, "")
            .indexOf(
              answer.code.toString().replace(/\n/g, "").replace(/ /g, "")
            ) > 0 && setSubmittedAnswer(answer)
      ); */
    } catch (error) {
      alert("Please try after 30 seconds");
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
  function handleMouseWheel(event, monaco) {
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
  }

  const ctrlPress = useKeyPress("Control");

  function useKeyPress(targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);

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

    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);

      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
  }

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
  }, [editorInstance, ctrlPress]);

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
    <>
      <Editor
        height={`${selectedLanguage === "javascript" ? "50vh" : "100%"}`}
        width={`${selectedLanguage === "javascript" ? "70%" : "100%"}`}
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
            submittedAnswer.length !== 0
              ? submittedAnswer
                ? "success"
                : "error"
              : ""
          }`}
        >
          <div className="btn-msg-container">
            <span
              onClick={handleSubmitValue}
              className="code-editor-submit-button"
            >
              Run
            </span>
            <span className="output-message">
              {submittedAnswer.length !== 0
                ? submittedAnswer
                  ? "Amazing, great job"
                  : "Wrong answer, but you got this"
                : ""}
            </span>
          </div>
          <h3>Output / Console</h3>
          <hr className="horizontal-line" />
          <div className="output-window__content">
            {submittedAnswer && (
              <p>
                Your answer was {submittedAnswer.code}, it's score is:{" "}
                {submittedAnswer.score}
              </p>
            )}
          </div>
          <a href={`/${selectedLanguage}/${topic}/${Number(exerciseNum) + 1}`}>
            Next Exercise
          </a>
        </div>
      )}
    </>
  );
};

export default CodeEditor;

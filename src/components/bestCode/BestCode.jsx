import { useState } from "react";
import axios from "axios";
import CodeEditor from "../codeEditor/CodeEditor";

const BestCode = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript"); // State for selected language
  const [feedback, setFeedback] = useState(null);

  const handleSubmitValue = async () => {
    setIsLoading(true);
    let content = `Ensure you adopt the following structure to assess and provide feedback on the user's response:
          {
            betterCode: String,
            badPractices: String,
            bestPractices: String,
            tips: String,
          }.
          Code: ${code}
          `;
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "user",
              content: content,
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
      setFeedback(result);
    } catch (error) {
      alert("Please try after 20 seconds");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <label htmlFor="languageSelect" className="form-label">
          Select Language
        </label>
        <select
          id="languageSelect"
          className="form-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="mb-3">
        <CodeEditor
          selectedLanguage={selectedLanguage}
          code={code}
          onChange={(value) => setCode(value)}
        />
      </div>

      <button
        className="btn btn-primary mb-3"
        onClick={handleSubmitValue}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Review my codes"}
      </button>

      {feedback && (
        <div className="card">
          <div className="card-header">Feedback</div>
          <div className="card-body">
            {feedback.betterCode && (
              <p>
                <strong>Better Code:</strong> {feedback.betterCode}
              </p>
            )}
            {feedback.badPractices && (
              <p>
                <strong>Bad Practices:</strong> {feedback.badPractices}
              </p>
            )}
            {feedback.bestPractices && (
              <p>
                <strong>Best Practices:</strong> {feedback.bestPractices}
              </p>
            )}
            {feedback.tips && (
              <p>
                <strong>Tips:</strong> {feedback.tips}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BestCode;

import React, { useReducer, useEffect, useCallback } from "react";
import Question from "./Question";
import CodeQuestion from "./CodeQuestion";
import Timer from "./Timer";
import Statistics from "./Statistics";
import LanguageList from "../languageList/LanguageList";
import axios from "axios";
import Spinner from "../spinner/Spinner";

const initialState = {
  questions: [],
  currentQuestion: 0,
  selectedAnswer: null,
  score: 0,
  time: 0,
  showStatistics: false,
  loading: false,
  code: "",
  submitting: false,
  error: null,
  currentMark: 0,
  currentPosition: 0,
  userAnswers: [],
};

function getNextQuestionData(state) {
  return {
    time: state.questions[state.currentQuestion + 1]?.time || 0,
    currentMark: state.questions[state.currentQuestion + 1]?.marks || 0,
    currentPosition: state.questions[state.currentQuestion + 1]?.position || 0,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_ANSWER": {
      const updatedAnswers = updateUserAnswers(state, {
        _id: state.questions[state.currentQuestion]._id,
        answer: action.payload,
        isCorrect:
          state.questions[state.currentQuestion].correctAnswer ===
          action.payload,
      });
      return {
        ...state,
        selectedAnswer: action.payload,
        userAnswers: updatedAnswers,
      };
    }

    case "UPDATE_CODE":
      return { ...state, code: action.payload };

    case "SUBMIT_CODE_START":
      return { ...state, submitting: true };

    case "SUBMIT_CODE_SUCCESS": {
      const updatedAnswers = updateUserAnswers(state, {
        _id: state.questions[state.currentQuestion]._id,
        answer: state.code,
        isCorrect: action.payload.isCorrect,
      });
      return {
        ...state,
        submitting: false,
        userAnswers: updatedAnswers,
        score: action.payload.isCorrect
          ? state.score + state.currentMark
          : state.score,
      };
    }

    case "SUBMIT_CODE_ERROR":
      return { ...state, submitting: false, error: action.payload };

    case "NEXT_QUESTION": {
      const nextData = getNextQuestionData(state);
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        selectedAnswer: null,
        code: "",
        ...nextData,
      };
    }

    case "INCREMENT_SCORE_BY_MARK":
      return {
        ...state,
        score: state.score + action.payload,
      };

    case "FETCH_QUESTIONS_START":
      return { ...state, loading: true, error: null };

    case "FETCH_QUESTIONS_SUCCESS": {
      const currentData = {
        time: action.payload[state.currentQuestion]?.time || 0,
        currentMark: action.payload[state.currentQuestion]?.marks || 0,
        currentPosition: action.payload[state.currentQuestion]?.position || 0,
      };
      return {
        ...state,
        questions: action.payload,
        loading: false,
        ...currentData,
      };
    }

    case "FETCH_QUESTIONS_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SHOW_STATISTICS":
      return { ...state, showStatistics: true };

    case "UPDATE_TIME":
      return { ...state, time: state.time - 1 };

    default:
      return state;
  }
}

function updateUserAnswers(state, newAnswer) {
  const index = state.userAnswers.findIndex((ans) => ans._id === newAnswer._id);
  const updatedAnswers = [...state.userAnswers];

  if (index !== -1) {
    updatedAnswers[index] = newAnswer;
  } else {
    updatedAnswers.push(newAnswer);
  }

  return updatedAnswers;
}

function Quiz() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchQuestions = useCallback(async (id) => {
    dispatch({ type: "FETCH_QUESTIONS_START" });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/quizzes`
      );
      let data = response.data.data.data;
      data = data.filter((quiz) => quiz.language._id === id);
      data.sort((a, b) => a.position - b.position);
      dispatch({
        type: "FETCH_QUESTIONS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      console.error("An error occurred:", error);
      dispatch({ type: "FETCH_QUESTIONS_ERROR", payload: error });
    }
  }, []);

  const currentQ = state.questions[state.currentQuestion];

  const nextQuestion = useCallback(() => {
    if (
      currentQ.type !== "coding" &&
      state.selectedAnswer === currentQ.correctAnswer
    ) {
      dispatch({
        type: "INCREMENT_SCORE_BY_MARK",
        payload: currentQ.marks,
      });
    }

    if (state.currentQuestion + 1 < state.questions.length) {
      dispatch({ type: "NEXT_QUESTION" });
    } else {
      dispatch({ type: "SHOW_STATISTICS" });
    }
  }, [
    currentQ,
    state.currentQuestion,
    state.questions.length,
    state.selectedAnswer,
  ]);

  useEffect(() => {
    if (!currentQ) {
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: "UPDATE_TIME" });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQ]);

  useEffect(() => {
    if (!currentQ) {
      return;
    }

    if (state.time === 0) {
      nextQuestion();
    }
  }, [nextQuestion, state.time, currentQ]);

  const handleOptionClick = (answer) => {
    dispatch({ type: "SELECT_ANSWER", payload: answer });
  };

  const handleCodeChange = (newCode) => {
    dispatch({ type: "UPDATE_CODE", payload: newCode });
  };

  const handleSubmitCode = async () => {
    dispatch({ type: "SUBMIT_CODE_START" });
    if (state.code === "") {
      dispatch({ type: "SUBMIT_CODE_SUCCESS", payload: { isCorrect: false } });
      nextQuestion();
      return;
    }
    let content = `I will provide you with a coding question and its corresponding answer for a thorough evaluation of its correctness. Your response format should adhere to: {isCorrect: true/false}
    Question:${currentQ.question},
    Answer: ${state.code}`;
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
      dispatch({ type: "SUBMIT_CODE_SUCCESS", payload: result });
      nextQuestion();
    } catch (error) {
      console.error("An error occurred:", error);
      dispatch({ type: "SUBMIT_CODE_ERROR", payload: error });
    }
  };

  return (
    <React.Fragment>
      {state.loading ? (
        <Spinner />
      ) : state.error ? (
        <div>Error: {state.error.message}</div>
      ) : state.questions.length === 0 ? (
        <LanguageList handleNext={fetchQuestions} />
      ) : (
        <div className="container my-5">
          <div className="row">
            <div
              className="col-12 mx-auto px-4 py-5 rounded-3"
              style={{ backgroundColor: "rgb(38, 70, 83)" }}
            >
              {state.showStatistics ? (
                <Statistics
                  score={state.score}
                  totalQuestions={state.questions.length}
                  questions={state.questions}
                  userAnswers={state.userAnswers}
                />
              ) : (
                <React.Fragment>
                  <h3>Question {state.currentPosition}</h3>
                  <p className="text-warning">Marks: {state.currentMark}</p>
                  {currentQ.type === "coding" ? (
                    <div>
                      <CodeQuestion
                        initialCode={currentQ.initialCode}
                        onCodeChange={handleCodeChange}
                        question={currentQ.question}
                        language={currentQ.language.name}
                      />
                      <button
                        onClick={handleSubmitCode}
                        className="btn my-3"
                        disabled={state.submitting}
                      >
                        {state.submitting ? "Loading..." : "Next"}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Question
                        question={currentQ.question}
                        options={currentQ.options}
                        selectedAnswer={state.selectedAnswer}
                        handleOptionClick={handleOptionClick}
                      />

                      <button
                        onClick={nextQuestion}
                        className="btn my-3"
                        disabled={state.selectedAnswer === null}
                      >
                        Next
                      </button>
                    </div>
                  )}
                  <Timer time={state.time} />
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Quiz;

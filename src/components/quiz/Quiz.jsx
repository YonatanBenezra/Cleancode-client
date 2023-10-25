import React, { useReducer, useEffect, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Question from "./Question";
import CodeQuestion from "./CodeQuestion";
import Timer from "./Timer";
import Statistics from "./Statistics";
import axios from "axios";
import Spinner from "../spinner/Spinner";
import Swal from "sweetalert2";

const initialState = {
  questions: [],
  currentQuestion: 0,
  selectedAnswer: null,
  score: 0,
  time: 0,
  showStatistics: false,
  showRules: true,
  loading: false,
  code: "",
  submitting: false,
  error: null,
  currentMark: 0,
  currentPosition: 1,
  userAnswers: [],
};

function getNextQuestionData(state) {
  return {
    time: state.questions[state.currentQuestion + 1]?.time || 0,
    currentMark: state.questions[state.currentQuestion + 1]?.marks || 0,
    currentPosition: state.currentPosition + 1 || 0,
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
        currentPosition: state.currentPosition || 0,
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

    case "HIDE_RULES":
      return { ...state, showRules: false };

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
function fisherYatesShuffle(array) {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // swap elements
  }
  return newArray;
}

function selectRandom(array, n) {
  return fisherYatesShuffle(array).slice(0, n);
}

function Quiz() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { quizId } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data.data.data);
      } catch (error) {
        console.error("There was an error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [quizId]);

  const fetchQuestions = useCallback(async (id) => {
    dispatch({ type: "FETCH_QUESTIONS_START" });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/questions?quiz=${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let questions = response.data.data.data;
      questions.sort((a, b) => a.position - b.position);

      // Separate questions by type
      const regularQuestions = questions.filter((q) => q.type === "regular");
      const codingQuestions = questions.filter((q) => q.type === "coding");
      const exerciseQuestions = questions.filter((q) => q.type === "exercise");

      // Randomly select questions
      const selectedQuestions = [
        ...selectRandom(regularQuestions, 25),
        ...selectRandom(codingQuestions, 12),
        ...selectRandom(exerciseQuestions, 13),
      ];

      // Shuffle the combined selected questions
      const shuffledSelectedQuestions = fisherYatesShuffle(selectedQuestions);

      dispatch({
        type: "FETCH_QUESTIONS_SUCCESS",
        payload: shuffledSelectedQuestions,
      });
      return { accessGranted: true };
    } catch (error) {
      console.error("An error occurred:", error);
      dispatch({ type: "FETCH_QUESTIONS_ERROR", payload: error });
      return error.response.data;
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
      const stats = {
        user: user._id,
        quiz: quizId,
        questionsAnswered: state.userAnswers.map((ans) => ({
          question: ans._id,
          selectedOption: ans.answer,
          isCorrect: ans.isCorrect,
        })),
        totalScore: state.score,
      };
      axios.post(`${import.meta.env.VITE_API_URL}/api/userQuizzes`, stats);
      dispatch({ type: "SHOW_STATISTICS" });
    }
  }, [
    currentQ?.correctAnswer,
    currentQ?.marks,
    currentQ?.type,
    quizId,
    state.currentQuestion,
    state.questions.length,
    state.score,
    state.selectedAnswer,
    state.userAnswers,
    user._id,
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
    let content = `I will provide you with a coding question and its corresponding answer for a thorough evaluation of its correctness. Your response format should adhere to: {isCorrect: true/false}. Don't send any response without this format.
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
  const checkToStartQuiz = async (id) => {
    dispatch({ type: "HIDE_RULES" });
    const { accessGranted } = await fetchQuestions(id);
    if (!accessGranted)
      Swal.fire(
        "Trial has ended!",
        "Your trial has ended. Unlock full access to the quiz by making a purchase now!",
        "info"
      ).then(() => {
        navigate(`/payment/${quizId}`);
      });
  };
  const trialsRemaining =
    user.trialQuizInfo?.find((quiz) => quiz.quiz === quizId)?.trialsRemaining ??
    3;

  return (
    <React.Fragment>
      {state.loading || loading ? (
        <Spinner />
      ) : state.error ? (
        <h2 className="display-5 text-center my-5">
          Error: {state.error.response.data.message}
        </h2>
      ) : state.showRules ? (
        <div className="container my-5">
          <div className="row">
            <div
              className="col-12 mx-auto px-4 py-5 rounded-3"
              style={{ backgroundColor: "rgb(38, 70, 83)" }}
            >
              <div className="text-center">
                <h2 className="display-5">Quiz Rules!</h2>
                <h4 className="my-3 text-warning">
                  You have {trialsRemaining} trials remaining!{" "}
                </h4>
                <div className="terms-and-conditions">
                  <ul className="list-group">
                    <li className="list-group-item">
                      The quiz consists of 10 questions.
                    </li>
                    <li className="list-group-item">
                      Each question has a unique time limit.
                    </li>
                    <li className="list-group-item">
                      Marks vary from question to question.
                    </li>
                    <li className="list-group-item">
                      Once answered, you cannot revisit previous questions.
                    </li>
                    <li className="list-group-item">
                      Skipping questions is not allowed.
                    </li>
                    <li className="list-group-item">
                      Reloading the page will result in disqualification.
                    </li>
                    <li className="list-group-item">
                      Opening another tab during the quiz will lead to
                      disqualification.
                    </li>
                    <li className="list-group-item">
                      Using AI assistance or external help will lead to
                      disqualification.
                    </li>
                    <li className="list-group-item">
                      Post-quiz, your results will be evaluated and verified
                      within 1-2 days.
                    </li>
                    <li className="list-group-item">
                      If eligible, we will contact you regarding the
                      certificate.
                    </li>
                    <li className="list-group-item">
                      If not selected for the certificate, repurchasing the quiz
                      is allowed.
                    </li>
                  </ul>
                  <button
                    className="btn my-3"
                    onClick={() => checkToStartQuiz(quizId)}
                  >
                    I have thoroughly reviewed the rule, Start{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  questions={state.questions}
                  userAnswers={state.userAnswers}
                />
              ) : (
                <React.Fragment>
                  <h3>
                    Question - {state.currentPosition} /{" "}
                    {state.questions.length}
                  </h3>
                  <p className="text-warning">Marks: {state.currentMark}</p>
                  {currentQ.type !== "regular" ? (
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
      <div id="container-f1a05f63016536eb9941bcfe94f17bae"></div>
    </React.Fragment>
  );
}

export default Quiz;

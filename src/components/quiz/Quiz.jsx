import React, { useState, useEffect, useCallback, useMemo } from "react";
import Question from "./Question";
import Timer from "./Timer";
import Statistics from "./Statistics";
import LanguageList from "../languageList/LanguageList";
import axios from "axios";
import Spinner from "../spinner/Spinner";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [showStatistics, setShowStatistics] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/quizzes`
      );
      const data = response.data.data.data;
      const filteredQuestions = data.filter((quiz) => quiz.language === id);
      setQuestions(filteredQuestions);
      setTime(filteredQuestions[currentQuestion].time);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = useMemo(
    () => questions[currentQuestion],
    [currentQuestion, questions]
  );

  const nextQuestion = useCallback(() => {
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    setSelectedAnswer(null);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion + 1);
      setTime(questions[currentQuestion + 1].time);
    } else {
      setShowStatistics(true);
    }
  }, [currentQuestion, questions, selectedAnswer, currentQ]);

  useEffect(() => {
    if (!currentQ) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, currentQ]);

  useEffect(() => {
    if (!currentQ) {
      return;
    }

    if (time === 0) {
      nextQuestion();
    }
  }, [nextQuestion, time, currentQ]);

  const handleOptionClick = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : questions.length === 0 ? (
        <LanguageList handleNext={fetchQuestions} />
      ) : (
        <div className="container my-5">
          <div className="row">
            <div
              className="col-12 mx-auto px-4 py-5 rounded-3"
              style={{ backgroundColor: "rgb(38,70,83)" }}
            >
              {showStatistics ? (
                <Statistics score={score} totalQuestions={questions.length} />
              ) : (
                <div>
                  <Question
                    question={currentQ.question}
                    options={currentQ.options}
                    selectedAnswer={selectedAnswer}
                    handleOptionClick={handleOptionClick}
                  />
                  <Timer time={time} />
                  <button
                    onClick={nextQuestion}
                    className="btn"
                    disabled={selectedAnswer === null}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Quiz;

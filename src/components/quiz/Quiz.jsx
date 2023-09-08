import { useState, useEffect, useCallback } from "react";
import Question from "./Question";
import Timer from "./Timer";
import Statistics from "./Statistics";

const questions = [
  {
    question:
      "What is the JavaScript syntax for printing something to the console?",
    options: [
      "print('Hello World')",
      "System.out.println('Hello World')",
      "console.log('Hello World')",
      "printf('Hello World')",
    ],
    correctAnswer: "console.log('Hello World')",
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "/* */", "##", "--"],
    correctAnswer: "//",
  },
  {
    question: "How do you declare a variable in JavaScript?",
    options: ["var x", "int x", "x", "declare x"],
    correctAnswer: "var x",
  },
  {
    question: "How do you create a function in JavaScript?",
    options: [
      "function myFunction()",
      "def myFunction()",
      "create myFunction()",
      "function = myFunction()",
    ],
    correctAnswer: "function myFunction()",
  },
  {
    question: "What is the correct way to write an array in JavaScript?",
    options: [
      "var colors = (1:'red', 2:'green', 3:'blue')",
      "var colors = 'red', 'green', 'blue'",
      "var colors = ['red', 'green', 'blue']",
      "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')",
    ],
    correctAnswer: "var colors = ['red', 'green', 'blue']",
  },
  {
    question:
      "How do you write a conditional statement for executing some code if 'i' is NOT equal to 5?",
    options: ["if i =! 5 then", "if i <> 5", "if (i != 5)", "if (i not 5)"],
    correctAnswer: "if (i != 5)",
  },
  {
    question: "How does a FOR loop start?",
    options: [
      "for i = 1 to 5",
      "for (i <= 5; i++)",
      "for (i = 0; i <= 5)",
      "for (i = 0; i <= 5; i++)",
    ],
    correctAnswer: "for (i = 0; i <= 5; i++)",
  },
  {
    question: "What is the correct way to write a JavaScript array?",
    options: [
      "var txt = new Array(1:'tim',2:'kim',3:'jim')",
      "var txt = new Array='tim','kim','jim'",
      "var txt = new Array('tim','kim','jim')",
      "var txt = new Array:1=('tim'),2=('kim'),3=('jim')",
    ],
    correctAnswer: "var txt = new Array('tim','kim','jim')",
  },
  {
    question: "Which event occurs when the user clicks on an HTML element?",
    options: ["onchange", "onmouseclick", "onmouseover", "onclick"],
    correctAnswer: "onclick",
  },
  {
    question: "What will the following code return: Boolean(10 > 9)?",
    options: ["NaN", "false", "true", "undefined"],
    correctAnswer: "true",
  },
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20); // set time limit for each question
  const [showStatistics, setShowStatistics] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextQuestion = useCallback(() => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    setSelectedAnswer(null);
    setTime(20);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion + 1);
    } else {
      setShowStatistics(true);
    }
  }, [currentQuestion, selectedAnswer]);

  useEffect(() => {
    if (time === 0) {
      nextQuestion();
    }
  }, [nextQuestion, time]);

  const handleOptionClick = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
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
                question={questions[currentQuestion].question}
                options={questions[currentQuestion].options}
                selectedAnswer={selectedAnswer}
                handleOptionClick={handleOptionClick}
              />
              <Timer time={time} />
              <button onClick={nextQuestion} className="btn btn-primary">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;

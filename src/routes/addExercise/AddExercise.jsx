import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import GlobalContext from "../../contexts/Global-Context";
import "./add-exercise.scss";
import axios from "axios";
import Success from "../../components/sucess/Success";

const AddExercise = () => {
  const { languages, topics } = useContext(GlobalContext);
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortedLanguages, setSortedLanguages] = useState([]);
  const [sortedTopics, setSortedTopics] = useState([]);

  useEffect(() => {
    if (languages && topics) {
      setSortedLanguages(languages.sort((a, b) => a.position - b.position));
      setSortedTopics(
        topics
          .filter((topic) => topic.language._id === selectedLanguage)
          .sort((a, b) => a.position - b.position)
      );
    }
  }, [languages, topics, selectedLanguage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      data.language = selectedLanguage;
      await axios.post(`${import.meta.env.VITE_API_URL}/api/exercises`, data);
      setSubmitted(true);
      reset();
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("An error occurred while adding the exercise.");
      console.error(err);
    }
  };
  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleNext = (id) => {
    clearErrors();
    setSelectedLanguage(id);
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <div className="add-exercise-container">
      {errorMessage && <div className="error">{errorMessage}</div>}
      {submitted ? (
        <Success setSubmitted={setSubmitted} />
      ) : (
        <React.Fragment>
          <span className="add-exercise-header">Add Exercise</span>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 ? (
              <div className="add-exercise-step">
                <h3>Select a language:</h3>
                <div className="add-exercise-languages">
                  {sortedLanguages.map((language, index) => (
                    <span
                      key={index}
                      className={`add-exercise-language`}
                      onClick={() => handleNext(language._id)}
                    >
                      {language.name}
                    </span>
                  ))}
                </div>
                {errors.language && (
                  <span className="add-exercise-error">
                    {errors.language.message}
                  </span>
                )}
              </div>
            ) : (
              <div className="add-exercise-step-two">
                <div className="add-exercise-form-group">
                  <label className="add-exercise-label">Topic</label>
                  <select
                    className="add-exercise-select"
                    {...register("topic", { required: true })}
                  >
                    <option value="">Select a topic</option>
                    {sortedTopics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.topic && (
                  <div className="add-exercise-error">
                    This field is required
                  </div>
                )}
                <div className="add-exercise-form-group">
                  <label className="add-exercise-label">Description</label>
                  <textarea
                    className="add-exercise-input"
                    {...register("description", { required: true })}
                  />
                  <span className="add-exercise-input-bottom-border"></span>
                </div>
                {errors.description && (
                  <div className="add-exercise-error">
                    This field is required
                  </div>
                )}

                <div className="add-exercise-form-group">
                  <label className="add-exercise-label">Code</label>
                  <textarea
                    className="add-exercise-input"
                    {...register("code", { required: true })}
                  />
                  <span className="add-exercise-input-bottom-border"></span>
                </div>
                {errors.code && (
                  <div className="add-exercise-error">
                    This field is required
                  </div>
                )}

                <div className="add-exercise-form-group">
                  <label className="add-exercise-label">Answer</label>
                  <textarea
                    className="add-exercise-input"
                    {...register("answer", { required: true })}
                  />
                  <span className="add-exercise-input-bottom-border"></span>
                </div>
                {errors.answer && (
                  <div className="add-exercise-error">
                    This field is required
                  </div>
                )}

                <div className="add-exercise-form-group">
                  <label className="add-exercise-label">Difficulty</label>
                  <input
                    className="add-exercise-input"
                    {...register("difficulty", { required: true })}
                    type="number"
                  />
                  <span className="add-exercise-input-bottom-border"></span>
                </div>
                {errors.difficulty && (
                  <div className="add-exercise-error">
                    This field is required
                  </div>
                )}

                <div className="add-exercise-form-group">
                  <label className="add-exercise-label">Position</label>
                  <input
                    className="add-exercise-input"
                    {...register("position", { required: true })}
                    type="number"
                  />
                  <span className="add-exercise-input-bottom-border"></span>
                </div>
                {errors.position && (
                  <div className="add-exercise-error">
                    This field is required
                  </div>
                )}

                <div className="add-exercise-buttons">
                  {step > 1 && (
                    <button
                      type="button"
                      className="add-exercise-button"
                      onClick={() => handleBack()}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type={step === 2 ? "submit" : "button"}
                    className="add-exercise-button"
                    onClick={() => step === 1 && handleNext()}
                  >
                    {step === 2 ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default AddExercise;

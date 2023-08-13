import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import GlobalContext from "../../contexts/Global-Context";
import "./add-exercise.scss";
import axios from "axios";
import Success from "../../components/sucess/Success";
import Dropzone from "react-dropzone";
import LanguageList from "../../components/languageList/LanguageList";

const AddExercise = () => {
  const { languages, topics, user } = useContext(GlobalContext);
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortedTopics, setSortedTopics] = useState([]);
  useEffect(() => {
    if (languages && topics) {
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
      if (user.role === "admin") data.approved = true;
      data.language = selectedLanguage;
      data.imageUrl = uploadedImage;
      await axios.post(`${import.meta.env.VITE_API_URL}/api/exercises`, data);
      setSubmitted(true);
      reset();
      setUploadedImage(null);
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
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("upload_preset", "cleancode");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/djkdk03mf/image/upload",
        formData
      );
      const imageUrl = response.data.secure_url;
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="container">
      {errorMessage && <div className="error">{errorMessage}</div>}
      {submitted ? (
        <Success setSubmitted={setSubmitted} />
      ) : (
        <React.Fragment>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 ? (
              <LanguageList handleNext={handleNext} />
            ) : (
              <div className="">
                <h1 className="pt-5 blog-title">Add Exercise</h1>

                <div className="mb-3">
                  <label htmlFor="topic" className="form-label blog-label">
                    Topic:
                  </label>
                  <select
                    className="form-select"
                    {...register("topic", { required: true })}
                  >
                    <option value="">Select a topic</option>
                    {sortedTopics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                  {errors.topic && (
                    <div className="add-exercise-error">*Topic is required</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="imgUrl" className="form-label blog-label">
                    Upload Demo Image:
                  </label>
                  <div>
                    <Dropzone onDrop={onDrop} accept="image/*">
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone-container" {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p className="dropzone-text">
                            Drag and drop an image here, or click to select an
                            image
                          </p>
                        </div>
                      )}
                    </Dropzone>
                    {uploadedImage && (
                      <div className="image-preview-container">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="image-preview"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label blog-label">Name:</label>
                  <input
                    className="form-control"
                    {...register("name", { required: true })}
                  />
                  <span className="add-exercise-input-bottom-border"></span>

                  {errors.name && (
                    <div className="add-exercise-error">*Name is required</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label blog-label">Description:</label>
                  <textarea
                    className="form-control"
                    rows="8"
                    {...register("description", { required: true })}
                  />
                  {/* <span className="add-exercise-input-bottom-border"></span> */}
                  {errors.description && (
                    <div className="add-exercise-error">
                      *Description is required
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label blog-label">Difficulty:</label>
                  <input
                    className="form-control"
                    {...register("difficulty", { required: true })}
                    type="number"
                  />
                  {/* <span className="add-exercise-input-bottom-border"></span> */}
                  {errors.difficulty && (
                    <div className="add-exercise-error">
                      *Difficulty level is required
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label blog-label">Position:</label>
                  <input
                    className="form-control"
                    {...register("position", { required: true })}
                    type="number"
                  />
                  {/* <span className="add-exercise-input-bottom-border"></span> */}
                  {errors.position && (
                    <div className="add-exercise-error">
                      *Position is required
                    </div>
                  )}
                </div>

                <div className="text-center pb-5">
                  {step > 1 && (
                    <button
                      type="button"
                      className="btn me-3"
                      onClick={() => handleBack()}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type={step === 2 ? "submit" : "button"}
                    className="btn"
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

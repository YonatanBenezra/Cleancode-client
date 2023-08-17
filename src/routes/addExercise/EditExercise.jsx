import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import GlobalContext from "../../contexts/Global-Context";
import Spinner from "../../components/spinner/Spinner";

const EditExercise = () => {
  const navigate = useNavigate();
  const { topics } = useContext(GlobalContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortedTopics, setSortedTopics] = useState([]);
  const [exercise, setExercise] = useState(null);
  const { exerciseId } = useParams();
  const [uploadedImage, setUploadedImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const getExercise = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/exercises/${exerciseId}`
        );
        const ex = response.data.data.data;
        setExercise(ex);
        setValue("topic", ex.topic._id);
      } catch (error) {
        console.error("Error fetching exercise:", error);
      }
    };
    getExercise();
  }, [exerciseId, setValue]);

  useEffect(() => {
    if (exercise && topics) {
      setSortedTopics(
        topics
          .filter((topic) => topic.language._id === exercise.topic.language)
          .sort((a, b) => a.position - b.position)
      );
    }
  }, [exercise, topics]);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        imgUrl: uploadedImage || data.imgUrl,
      };
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/exercises/${exerciseId}`,
        updatedData
      );
      setExercise(null);
      setErrorMessage("");
      location.href = "/dashboard";
    } catch (err) {
      setErrorMessage("An error occurred while editing the exercise.");
      console.error(err);
    }
  };

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("upload_preset", "cleancode");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/djkdk03mf/image/upload",
        formData
      );
      const imgUrl = response.data.secure_url;
      setUploadedImage(imgUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="container">
      {errorMessage && <div className="error">{errorMessage}</div>}
      {!exercise ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <h1 className="pt-5 blog-title">Edit Exercise</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="topic" className="form-label blog-label">
                Topic:
              </label>
              <select
                className="form-select"
                defaultValue={exercise.topic._id}
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
              <Dropzone onDrop={onDrop} accept="image/*">
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone-container" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className="dropzone-text">
                      Drag and drop an image here, or click to select an image
                    </p>
                  </div>
                )}
              </Dropzone>
              {(uploadedImage || exercise.imgUrl) && (
                <div className="image-preview-container">
                  <img
                    src={uploadedImage || exercise.imgUrl}
                    alt={uploadedImage ? "Uploaded" : "Current"}
                    className="image-preview"
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label blog-label">Name:</label>
              <input
                className="form-control"
                defaultValue={exercise.name}
                {...register("name", { required: true })}
              />
              {errors.name && (
                <div className="add-exercise-error">*Name is required</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label blog-label">Description:</label>
              <textarea
                className="form-control"
                rows="8"
                defaultValue={exercise.description}
                {...register("description", { required: true })}
              />
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
                defaultValue={exercise.difficulty}
                {...register("difficulty", { required: true })}
                type="number"
              />
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
                defaultValue={exercise.position}
                {...register("position", { required: true })}
                type="number"
              />
              {errors.position && (
                <div className="add-exercise-error">*Position is required</div>
              )}
            </div>

            <div className="text-center pb-5">
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default EditExercise;

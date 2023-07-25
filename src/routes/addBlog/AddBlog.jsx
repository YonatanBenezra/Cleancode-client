import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useState } from "react";

function AddBlog() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      title: "",
      imgUrl: "",
      content: "",
      author: "",
      tags: [],
    },
  });
  const [uploadedImg, setUploadedImg] = useState(null);

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
      setValue("imgUrl", imageUrl);
      setUploadedImg(imageUrl);
      trigger("imgUrl");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const onSubmit = async (data) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, data);
    reset();
    alert("Blog post created successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="title">Title:</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <input
              type="text"
              id="title"
              {...field}
              placeholder="Enter the title of the blog"
            />
          )}
        />
        {errors.title && <span>{errors.title.message}</span>}
      </div>

      <div>
        <label htmlFor="imgUrl">Image URL:</label>
        <Controller
          name="imgUrl"
          control={control}
          rules={{ required: "Image URL is required" }}
          render={({ field }) => (
            <div>
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
              {uploadedImg && (
                <div>
                  <img
                    src={uploadedImg}
                    alt="Uploaded"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              )}
            </div>
          )}
        />
        {errors.imgUrl && <span>{errors.imgUrl.message}</span>}
      </div>

      <div>
        <label htmlFor="content">Content:</label>
        <Controller
          name="content"
          control={control}
          rules={{ required: "Content is required" }}
          render={({ field }) => (
            <ReactQuill
              id="content"
              value={field.value}
              onChange={field.onChange}
              placeholder="Write your blog content here"
            />
          )}
        />
        {errors.content && <span>{errors.content.message}</span>}
      </div>

      <div>
        <label htmlFor="author">Author:</label>
        <Controller
          name="author"
          control={control}
          rules={{ required: "Author is required" }}
          render={({ field }) => (
            <input
              type="text"
              id="author"
              {...field}
              placeholder="Enter the author's name"
            />
          )}
        />
        {errors.author && <span>{errors.author.message}</span>}
      </div>

      <div>
        <label htmlFor="tags">Tags:</label>
        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field }) => <TagsInput {...field} />}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default AddBlog;

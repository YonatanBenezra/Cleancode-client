import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useState } from "react";
import "./add-blog.scss";

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
      const imgUrl = response.data.secure_url;
      setValue("imgUrl", imgUrl);
      setUploadedImg(imgUrl);
      trigger("imgUrl");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const onSubmit = async (data) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/blogs`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    reset();
    alert("Blog post created successfully!");
  };

  return (
    <div className="container">
      <h1 className="pt-5 blog-title">Add Blog</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label blog-label">
            Title:
          </label>
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
                className="form-control"
              />
            )}
          />
          {errors.title && (
            <span className="text-danger">*{errors.title.message}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="imgUrl" className="form-label blog-label">
            Upload Image:
          </label>
          <Controller
            name="imgUrl"
            control={control}
            rules={{ required: "Image is required" }}
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
          {errors.imgUrl && (
            <span className="text-danger">*{errors.imgUrl.message}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label blog-label">
            Content:
          </label>
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
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block"],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ["clean"],
                  ],
                }}
                theme="snow"
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                  "color",
                  "background",
                  "font",
                  "align",
                  "direction",
                  "size",
                ]}
                className="blog-text-editor"
              />
            )}
          />
          {errors.content && (
            <span className="text-danger">*{errors.content.message}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="author" className="form-label blog-label">
            Author:
          </label>
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
                className="form-control"
              />
            )}
          />
          {errors.author && (
            <span className="text-danger">*{errors.author.message}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="tags" className="form-label blog-label">
            Tags:
          </label>
          <Controller
            name="tags"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <TagsInput {...field} className="form-control blog-tags" />
            )}
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddBlog;

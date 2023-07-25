import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router for handling routes
import axios from "axios"; // Assuming you use Axios for API requests

const BlogDetails = () => {
  const { blogId } = useParams(); // Get the blog blogId from the URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`
      );
      setBlog(response.data.data.data);
    })();
  }, [blogId]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <img src={blog.imgUrl} alt={blog.title} />
      <p>{blog.content}</p>
      <p>Author: {blog.author}</p>
      <p>Tags: {blog.tags.join(", ")}</p>
    </div>
  );
};

export default BlogDetails;

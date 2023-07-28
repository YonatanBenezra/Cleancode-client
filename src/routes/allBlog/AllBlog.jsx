import { useEffect, useState } from "react";
import axios from "axios"; // Assuming you use Axios for API requests
import { Link } from "react-router-dom";

const AllBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/blogs`
      );
      setBlogs(response.data.data.data);
    })();
  }, []);
  const renderHTML = (htmlContent) => {
    return { __html: htmlContent };
  };
  return (
    <div>
      <h1>All Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <img src={blog.imgUrl} alt={blog.title} />
          <p dangerouslySetInnerHTML={renderHTML(blog.content)} />
          <p>Author: {blog.author}</p>
          <p>Tags: {blog.tags.join(", ")}</p>
          <Link to={`/blog/${blog._id}`}>Details</Link>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default AllBlog;

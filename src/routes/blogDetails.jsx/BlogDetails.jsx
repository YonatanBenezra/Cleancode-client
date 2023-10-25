import { useEffect, useState } from "react";
import "./blog-details.scss";
import { useParams } from "react-router-dom"; // Assuming you're using React Router for handling routes
import axios from "axios"; // Assuming you use Axios for API requests
import Spinner from "../../components/spinner/Spinner";

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
  const renderHTML = (htmlContent) => {
    return { __html: htmlContent };
  };

  if (!blog) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="container">
        <div className="row py-3">
          <h1 className="blog-title">{blog.title}</h1>
          <img className="blog-img" src={blog.imgUrl} alt={blog.title} />
          <p
            dangerouslySetInnerHTML={renderHTML(blog.content)}
            className="blog-content"
          />
          {/* <p>Author: {blog.author}</p> */}
          <p className="detailed-tags ms-2">Tags: {blog.tags.join(", ")}</p>
        </div>
      </div>

      <div id="container-f1a05f63016536eb9941bcfe94f17bae"></div>
    </div>
  );
};

export default BlogDetails;

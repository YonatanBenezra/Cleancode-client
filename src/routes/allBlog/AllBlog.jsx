import { useEffect, useState } from "react";
import axios from "axios"; // Assuming you use Axios for API requests
import { Link } from "react-router-dom";
import "./all-blog.scss";

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
      <div className="container">
        <h1>All Blogs</h1>
        <div className="row gy-3">
          {blogs.map((blog) => (
            <div
              className="my-3 col-xl-4 col-lg-6 col-md-6 col-sm-12 col-xs-12"
              key={blog._id}
            >
              <div className="card main-card">
                <img
                  src={blog.imgUrl}
                  alt={blog.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p
                    dangerouslySetInnerHTML={renderHTML(
                      blog.content.slice(0, 200) + "..."
                    )}
                    className="blog-content"
                  />

                  {/* <p>Author: {blog.author}</p> */}
                  <p className="tags">{blog.tags.join(", ")}</p>
                  <Link className="details" to={`/blog/${blog._id}`}>
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBlog;

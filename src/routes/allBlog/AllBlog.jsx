import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./all-blog.scss";

const AllBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/blogs`
      );
      setBlogs(response.data.data.data);
    })();
  }, []);

  // Count tags and get unique tags
  const tagsCount = blogs.reduce((acc, blog) => {
    blog.tags.forEach((tag) => {
      if (acc[tag]) {
        acc[tag]++;
      } else {
        acc[tag] = 1;
      }
    });
    return acc;
  }, {});

  const toggleTag = (tag) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((tg) => tg !== tag)
        : [...selectedTags, tag]
    );
  };

  const renderHTML = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <div>
      <div className="container">
        <h1 className="my-5 text-center page-title">All Blogs</h1>

        {/* Add search field */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="form-control mb-3"
        />

        {/* Add tag buttons */}
        <div className="mt-3 mb-5">
          {Object.keys(tagsCount).map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`btn me-2 mt-sm-2 ${
                selectedTags.includes(tag) ? "active" : ""
              }`}
            >
              {tag} ({tagsCount[tag]})
            </button>
          ))}
        </div>

        <div className="row gy-3">
          {blogs
            .filter((blog) =>
              blog.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((blog) =>
              selectedTags.length > 0
                ? blog.tags.some((tag) => selectedTags.includes(tag))
                : true
            )
            .map((blog) => (
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
                    <p className="tags">{blog.tags.join(", ")}</p>
                    <Link className="btn btn-primary" to={`/blog/${blog._id}`}>
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

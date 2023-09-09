import "./test.scss";
function Test() {
  return (
    <div>
      <button
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#descriptionModal"
      >
        Click
      </button>
      <button
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#feedbackModal"
      >
        Click
      </button>
      <div className="modal" id="descriptionModal" tabIndex="-1">
        {/* <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                {" "}
                {`In this exercise, you will practice using the <h1> tag in HTML to create the main heading of a webpage. The <h1> tag represents the highest level of heading and is typically used to display the most important information on a page. Let's start by creating a simple HTML page and using the <h1> tag to display the text "Hello, World!`}
              </p>
            </div>
          </div>
        </div> */}
      </div>
      {/* <div className="modal" id="feedbackModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                <p>
                  Your answer was{" "}
                  <span style={{ color: "green" }} className="span">
                    Wrong (red,green)
                  </span>
                  .
                </p>
                <p>
                  Its score is: <span className="span">50 </span>
                </p>
                <p>
                  <span className="span">Hints</span>: The variable name should
                  match the one specified in the goal. Make sure to use correct
                  capitalization.
                </p>
                <p>
                  <span className="span">Bad Practices</span>: Variable names
                  are case-sensitive in JavaScript, so 'myVar' and 'myvar' are
                  not the same.
                </p>
                <p>
                  <span className="span">Best Practices</span>: Remember to use
                  camelCase notation for variable names in JavaScript. Also,
                  make sure to use the assignment operator (=) to assign a value
                  to a variable.
                </p>
                <p>
                  <span className="span">Tips</span>: Always double-check
                  variable names and ensure they match the requirements exactly.
                  Pay attention to capitalization and use camelCase notation for
                  better code readability. Additionally, remember to use the
                  assignment operator (=) to assign values.
                </p>
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="modal-btn">
                Next Exercise
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Test;

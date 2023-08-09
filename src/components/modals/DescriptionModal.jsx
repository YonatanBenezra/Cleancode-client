const DescriptionModal = ({ title, description }) => {
  return (
    <div className="modal" id="descriptionModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{ background: "var(--third-color)" }}
        >
          <div className="modal-header">
            <h5 className="modal-title" style={{ textTransform: "capitalize" }}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;

const Spinner = () => {
  return (
    <div className="text-center spinner">
      <div
        className="spinner-border"
        role="status"
        style={{ width: "60px", height: "60px", color: "#e9c46a" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;

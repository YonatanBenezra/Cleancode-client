import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { exercises, setExercises } = useContext(GlobalContext);
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this exercise?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/exercises/${id}`
        );

        const updatedExercises = exercises.filter(
          (exercise) => exercise._id !== id
        );
        setExercises(updatedExercises);
      } catch (error) {
        console.error("Error deleting exercise:", error);
      }
    }
  };
  const handleApprove = async (id) => {
    if (confirm("Are you sure you want to approve this exercise?")) {
      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/exercises/${id}`,
          { approved: true }
        );
        const updatedExercises = exercises.map((exercise) => {
          if (exercise._id === id) {
            exercise.approved = true;
          }
          return exercise;
        });
        setExercises(updatedExercises);
      } catch (error) {
        console.error("Error approving exercise:", error);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="my-5 text-center">Manage Exercises</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered dashboard-table">
          <thead className="thead-dark">
            <tr>
              <th>Id</th>
              <th>Language Name</th>
              <th>Topic Name</th>
              <th>Exercise Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises
              .filter((exercise) => !exercise.approved)
              .map((exercise, i) => (
                <tr key={exercise._id}>
                  <td>{i + 1}</td>
                  <td>{exercise.topic.language.name}</td>
                  <td>{exercise.topic.name}</td>
                  <td>{exercise.name}</td>
                  <td>{exercise.description}</td>
                  <td>
                    <div className="d-flex gap-3">
                      <Link
                        to={`/edit-exercise/${exercise._id}`}
                        className="btn maximize-minimize-btn"
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </Link>
                      <button
                        className="btn maximize-minimize-btn"
                        onClick={() => handleDelete(exercise._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>

                      <button
                        className="btn maximize-minimize-btn"
                        onClick={() => handleApprove(exercise._id)}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

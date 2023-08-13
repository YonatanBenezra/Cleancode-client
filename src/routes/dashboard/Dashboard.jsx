import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";

const Dashboard = () => {
  const { exercises } = useContext(GlobalContext);

  return (
    <div className="container">
      <h2>Design a beautiful table</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered ">
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
                    <button className="btn btn-primary">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                    <button className="btn btn-success">Approve</button>
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

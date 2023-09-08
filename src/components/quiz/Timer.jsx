import PropTypes from "prop-types";

function Timer({ time }) {
  return <p className="text-warning">Time Remaining: {time} seconds</p>;
}

Timer.propTypes = {
  time: PropTypes.number.isRequired,
};

export default Timer;

import PropTypes from "prop-types";
import Certificate from "./Certificate";
import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";
import { PDFDownloadLink } from "@react-pdf/renderer";

function Statistics({ score, totalQuestions }) {
  const { user } = useContext(GlobalContext);
  return (
    <div className="text-center">
      <h2>Quiz Completed!</h2>
      <p className="display-5 text-warning mt-4">
        Your Score: {score}/{totalQuestions}
      </p>
      <button className="btn btn-primary">
        <PDFDownloadLink
          document={
            <Certificate
              username={user.name}
              score={(score / totalQuestions) * 100}
            />
          }
          fileName="certificate.pdf"
        >
          {({ loading }) =>
            loading ? "Loading document..." : "Download Certificate!"
          }
        </PDFDownloadLink>
      </button>
    </div>
  );
}

Statistics.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

export default Statistics;

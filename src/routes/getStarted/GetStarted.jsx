import { useNavigate } from "react-router-dom";
import LanguageList from "../../components/languageList/LanguageList";
import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";

const GetStarted = () => {
  const { languages } = useContext(GlobalContext);

  const navigate = useNavigate();

  const handleNext = (path) => {
    const uri = languages.find((language) => language._id === path).name;
    navigate(`/${uri}`);
  };
  return (
    <div style={{ paddingTop: "100px" }}>
      <LanguageList handleNext={handleNext} />
    </div>
  );
};

export default GetStarted;

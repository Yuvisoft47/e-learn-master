import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Game from "./Game";

const DynamicQuestions = () => {
  const { id } = useParams(); // Get route parameter
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    // Dynamically import based on the id parameter
    import(`../data/questions${id}.jsx`)
      .then((module) => {
        setQuestions(module.questions); // Access the named export
      })
      .catch((error) => {
        console.error("Error loading questions:", error);
        setQuestions([]); // Fallback if the file doesn't exist
      });
  }, [id]);

  if (!questions) {
    return <div>Loading questions...</div>; // Loader while fetching data
  }

  return <Game questions={questions} />;
};

export default DynamicQuestions;

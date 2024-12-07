import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DynamicQuestions from "./components/DynamicQuestions";

const App = () => (
  <Router>
    <Routes>
      <Route path="/questions/:id" element={<DynamicQuestions />} />
      <Route path="/" element={<div>Select a question set to begin.</div>} />
    </Routes>
  </Router>
);

export default App;

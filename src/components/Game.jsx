import React, { useEffect, useState } from "react";
import SpeechRecognition, {  useSpeechRecognition, } from "react-speech-recognition";
import "./Game.css";

const Game = ({ questions }) => {
  const [isSplashScreenVisible, setIsSplashScreenVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  // Function to read the current question aloud using text-to-speech
  const readQuestionAloud = (question) => {
    const speech = new SpeechSynthesisUtterance(question);
    speech.lang = "en-US"; // Set the language to English
    window.speechSynthesis.speak(speech);
  };

  // Function to handle the game start
  const handleStartGame = () => {
    setIsTransitioning(true); // Trigger the fade-out transition.
    setTimeout(() => {
      setIsSplashScreenVisible(false); // Hide splash screen after transition.
      readQuestionAloud(questions[currentQuestionIndex].question); // Read the first question aloud
    }, 1000); // Duration matches CSS transition time.
  };

  // Function to handle when user taps to speak
  const handleTapToSpeak = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      handleResult(transcript); // Evaluate the transcript when the user stops speaking.
    } else {
      resetTranscript(); // Clear previous transcript.
      SpeechRecognition.startListening();
    }
  };

  // Function to handle the result and move to next question
  const handleResult = (userInput) => {
    const currentQuestion = questions[currentQuestionIndex];
    const similarity =
      userInput.toLowerCase() === currentQuestion.answer.toLowerCase();

    if (similarity) {
      readQuestionAloud("Correct Answer");
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      readQuestionAloud(
        `Incorrect, The correct answer is ${currentQuestion.answer}`
      );
      setFeedback("❌ Incorrect. Try Again!");
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        readQuestionAloud(questions[currentQuestionIndex + 1].question); // Read the next question aloud
      } else {
        setShowResultPopup(true);
      }
    }, 2000);
  };

  const restartGame = () => {
    setShowResultPopup(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    resetTranscript();
  };

  return (
    <div className="game-container">
      {isSplashScreenVisible ? (
        <div className={`splash-screen ${isTransitioning ? "fade-out" : ""}`}>
          <h1 className="splash-title">🎮 English Learning Game</h1>
          <p className="splash-subtitle">Learn while having fun!</p>
          <button className="play-button" onClick={handleStartGame}>
            Play Game
          </button>
        </div>
      ) : (
        <>
          <h1 className="game-title">English Game</h1>
          {/* Person Asking the Question */}
          <div className="person-container">
            <img
              src="C:\Users\ASUS\Downloads\e-learn-master\e-learn-master\src\components\images\person-asking.png"
              alt="Person Asking"
              className="person-image"
            />
            <div className="chat-bubble">
              <p>
                Question {currentQuestionIndex + 1}:{" "}
                {questions[currentQuestionIndex].question}
              </p>
            </div>
          </div>

          <div className="required-answer">
            <p className="recorded-answer-title">
              Required Answer ={questions[currentQuestionIndex].answer}:
            </p>
          </div>

          {/* Display User's Recorded Answer */}
          <div className="recorded-answer-container">
            <p className="recorded-answer-title">Your Answer:</p>
            <p className="recorded-answer">{transcript || "..."}</p>
          </div>

          {/* Control Section */}
          <div className="control-section">
            <button className="control-btn" onClick={handleTapToSpeak}>
              {listening ? "Listening..." : "Tap to Speak"}
            </button>
          </div>

          {/* Feedback and Popups */}
          <div className="feedback-container">
            {feedback && <p className="feedback">{feedback}</p>}
          </div>

          {showPopup && (
            <div className="popup">
              <h2>{feedback}</h2>
            </div>
          )}

          {showResultPopup && (
            <div className="result-popup">
              <h1>Game Over!</h1>
              <div className="score-animation">
                <span className="score-number">{score}</span>
                <p>Points</p>
              </div>
              <button className="restart-btn" onClick={restartGame}>
                Play Again
              </button>
            </div>
          )}

          <h3>Score: {score}</h3>
        </>
      )}
    </div>
  );
};

export default Game;

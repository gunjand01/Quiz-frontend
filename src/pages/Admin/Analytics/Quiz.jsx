import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Button from '../../../components/Button';
import image from '../../../svg/congrats-img.png';

const Quiz = () => {
  const { id } = useParams(); // Quiz ID from URL
  const [questions, setQuestions] = useState([]); // Store questions separately
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]); // Store user's answers
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30); // Default timer value

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/quiz/question/${id}`);
        setQuestions(response.data);

        // Check if there are questions and set the timer
        if (response.data.length > 0) {
          setTimer(response.data[0].timer || 30); // Set timer for the first question
        } else {
          toast.error('No questions found in this quiz');
        }
      } catch (err) {
        toast.error('Failed to fetch quiz data');
        console.error(err);
      }
    };
    fetchQuiz();
  }, [id]);

  // Handle the countdown timer
  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion();
    } else if (timer !== null) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleOptionSelect = (optionId, optionIndex) => {
    setSelectedOption(optionId);
    // Store user's answer
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = optionIndex + 1; // Store the option index (1-based)
    setUserAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      // Move to the next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedOption(null);
        setTimer(questions[currentQuestionIndex + 1]?.timer || 30);
      } else {
        // Last question, submit the quiz
        handleSubmitQuiz();
      }
    } else {
      toast.error('Please select an option before proceeding');
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/quiz/updateQuizWithUserAnswers`, {
        quizId: id,
        userAnswers
      });

      console.log(response);
      if (response.data.success) {
        setScore(response.data.score);                                                           
        toast.success(`Quiz completed! Your score is ${response.data.score}/${questions.length}`);
      } else {
        toast.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  if (questions.length === 0) {
    return <div>No questions available for this quiz.</div>;
  }

  return (
    <div>
      <div>
        <p>{questions[currentQuestionIndex]}</p>
        <div>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <div key={option._id}>
              <input
                type="radio"
                id={option._id}
                name="quiz-option"
                value={option._id}
                onChange={() => handleOptionSelect(option._id, index)}
                checked={selectedOption === option._id}
              />
              <label htmlFor={option._id}>{option.text}</label>
            </div>
          ))}
        </div>
        <div>
          <p>Time remaining: {timer} seconds</p>
        </div>
        <Button onClick={handleNextQuestion}>
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default Quiz;

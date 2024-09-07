import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './QuestionWiseAnalysis.module.css';

const QuizAnalysis = () => {
  const { id: quizId } = useParams();
  const [analysisData, setAnalysisData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchQuizAnalysis = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/quiz/analysis/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust token retrieval based on your implementation
          },
        }
      );
      setAnalysisData(response.data.analysisData);
      console.log(response.data.analysisData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizAnalysis();
  }, [quizId]);

  if (isLoading) return <p>Loading analysis...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.quizAnalysisContainer}>
      {analysisData.map((question, index) => (
        <div key={index} className={styles.questionContainer}>
           <h2 className={styles.heading}>{question.quizTitle} Question Analysis</h2>
          
          <h3 className={styles.questionText}>
            {index + 1}. {typeof question.question === 'string' ? question.question : JSON.stringify(question.question)}
          </h3>
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <p>Attempted</p>
              <span>{question.attemptedCount}</span>
            </div>
            <div className={styles.statBox}>
              <p>Correct</p>
              <span>{question.correctCount}</span>
            </div>
            <div className={styles.statBox}>
              <p>Incorrect</p>
              <span>{question.wrongCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizAnalysis;

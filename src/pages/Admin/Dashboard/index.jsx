import React, { useContext, useEffect, useState, useMemo } from 'react';
import styles from './index.module.css';
import useFetch, { fetchQuestionsForQuizzes } from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthProvider';
import eye from '../../../svg/eye icon.png';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { token } = user;

  const url = useMemo(() => process.env.REACT_APP_BACKEND_URL + '/api/v1/quiz/quizzes', []);
  const options = useMemo(() => ({ headers: { Authorization: 'Bearer ' + token } }), [token]);

  const { data: quizzes, isLoading, error } = useFetch(url, options);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    if (quizzes && quizzes.length > 0) {
      const totalImpressions = quizzes.reduce((acc, quiz) => acc + (quiz.impressions || 0), 0);
      setTotalImpressions(totalImpressions);

      const fetchQuestions = async () => {
        setLoadingQuestions(true);
        try {
          const questionCount = await fetchQuestionsForQuizzes(quizzes, token);
          setTotalQuestions(questionCount);
        } catch (error) {
          console.error('Error calculating total questions:', error);
        } finally {
          setLoadingQuestions(false);
        }
      };

      fetchQuestions();
    }
  }, [quizzes, token]);

  // Function to format the createdAt date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.dashboard}>
      {loadingQuestions ? (
        <p>Loading questions...</p>
      ) : (
        <>
          <div className={styles.topRow}>
            <div className={`${styles.box} ${styles.orange}`}>
              <p className={styles.numberLabel}>
                <span className={styles.number}>{quizzes ? quizzes.length : 0}</span> 
                <span>Quiz</span>
              </p>
              <p className={styles.label}>Created</p>
            </div>
            <div className={`${styles.box} ${styles.green}`}>
              <p className={styles.numberLabel}>
                <span className={styles.number}>{totalQuestions}</span>
                <span>questions</span>
              </p>
              <p className={styles.label}>Created</p>
            </div>
            <div className={`${styles.box} ${styles.blue}`}>
              <p className={styles.numberLabel}>
                <span className={styles.number}>{totalImpressions}</span>
                <span>Total</span>
              </p>
              <p className={styles.label}>Impressions</p>
            </div>
          </div>

          <h2 className={styles.trendingTitle}>Trending Quizzes</h2>
          <div className={styles.gridContainer}>
            {quizzes && quizzes.slice(0, 16).map((quiz, index) => (
              <div 
                key={index} 
                className={styles.gridBox}
              >
                <p className={styles.gridItem}>{quiz.title}</p>
                <p className={styles.Created}>Created on : {formatDate(quiz.createdAt)}</p> {/* Displaying formatted date */}
                <div className={styles.impressionsContainer}>
                  <span>{quiz.impressions || 0}</span>
                  <img src={eye} alt="Impressions" className={styles.eyeIcon} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isLoading && !loadingQuestions && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default Dashboard;

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(url, options);
  
      if (!res.ok) {
        const errObj = await res.json();
        throw new Error(errObj.message);
      }
  
      const resObj = await res.json();
      // console.log('Response object:', resObj);
      setData(resObj.quizzes); // Access the quizzes array from the response
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, [fetchData]);

  return { data, error, isLoading,  refetch };
}

export async function fetchQuestionsForQuizzes(quizzes, token) {
    const questionsCount = quizzes.reduce(async (totalPromise, quiz) => {
      const total = await totalPromise;
      const quizUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/quiz/question/${quiz._id}`;
      const quizOptions = { headers: { Authorization: 'Bearer ' + token } };
      
      try {
        const res = await fetch(quizUrl, quizOptions);
        
        if (!res.ok) {
        //   console.error(`Error fetching questions for quiz: ${quiz._id} - Status: ${res.status}`);
          return total; // Skip this quiz and continue
        }
        
        const quizData = await res.json();
        // console.log(quizData);

        const questionTexts = quizData.map(question => question.text);

        // console.log(questionTexts.length);
        
        const totalQuestions = quizData.reduce((total, quiz) => total + questionTexts.length, 0);
        // console.log(totalQuestions);
        return totalQuestions;
    

      } catch (error) {
        // console.error(`Error fetching questions for quiz: ${quiz._id}`, error);
        return total; // Skip this quiz and continue
      }
      
    }, Promise.resolve(0)); // Initial total is 0
  
    return questionsCount;
  }
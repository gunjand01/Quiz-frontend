import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import axios from "axios"; // Import axios
import { AuthContext } from "./AuthProvider";

export const QuizContext = createContext({
  quizzes: [],
  isLoading: false,
  fetchQuizzes: async () => {},
  addQuiz: async () => {},
  updateQuiz: async () => {},
  deleteQuiz: async () => {},
});

export default function QuizProvider({ children }) {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { token } = user;

  const fetchQuizzes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/quiz/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const addQuiz = async (quizData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/quiz/quizzes`,
        quizData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('API response:', response.data);
      return response.data; // Ensure you return the data
    } catch (error) {
      console.error('Error in addQuiz:', error.message);
      throw error;
    }
  };

  const updateQuizInDb = useCallback(
    async (quizId, updates) => {
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/quizzes/${quizId}`,
          updates,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.data.quiz;
      } catch (error) {
        console.error("Error updating quiz:", error.message);
        toast.error(error.message);
        throw error;
      }
    },
    [token]
  );

  const updateQuiz = useCallback(
    async (quizId, updates) => {
      const updatedQuiz = await updateQuizInDb(quizId, updates);
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) => (quiz._id === quizId ? updatedQuiz : quiz))
      );
    },
    [updateQuizInDb]
  );

  const deleteQuizFromDb = useCallback(
    async (quizId) => {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/quizzes/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Deleted Quiz successfully");
      } catch (error) {
        console.error("Error deleting quiz:", error.message);
        toast.error(error.message);
        throw error;
      }
    },
    [token]
  );

  const deleteQuiz = useCallback(
    async (quizId) => {
      await deleteQuizFromDb(quizId);
      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz._id !== quizId)
      );
    },
    [deleteQuizFromDb]
  );

  return (
    <QuizContext.Provider
      value={useMemo(() => ({
        quizzes,
        isLoading,
        fetchQuizzes,
        addQuiz,
        updateQuiz,
        deleteQuiz,
      }), [quizzes, isLoading, fetchQuizzes, addQuiz, updateQuiz, deleteQuiz])}
    >
      {children}
    </QuizContext.Provider>
  );
}

QuizProvider.propTypes = {
  children: PropTypes.node,
};

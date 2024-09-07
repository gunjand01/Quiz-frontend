import React, { useContext, useMemo, useState } from "react";
import {useNavigate} from "react-router-dom"; 
import toast from "react-hot-toast";
import styles from "./index.module.css";
import useFetch from "../../../hooks/useFetch";
import useModal from "../../../hooks/useModal";
import copyLink from "../../../store/copyLink";
import { AuthContext } from "../../../context/AuthProvider";
import { QuizContext } from "../../../context/QuizProvider";
import EditIcon from "../../../svg/icons8-edit-48.png";
import DeleteIcon from "../../../svg/icons8-waste-24.png";
import ShareIcon from "../../../svg/icons8-share-24.png";
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import axios from "axios";

const Index = () => {
  const { user } = useContext(AuthContext);
  const { isOpen: deleteIsOpen, toggleModal: toggleDeleteModal } = useModal();
  const { token } = user;
  const navigate = useNavigate(); 

  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const url = useMemo(
    () => process.env.REACT_APP_BACKEND_URL + "/api/v1/quiz/quizzes",
    []
  );
  const options = useMemo(
    () => ({ headers: { Authorization: "Bearer " + token } }),
    [token]
  );

  const { data, error, refetch } = useFetch(url, options);

  const handleQuizDelete = async() => {
    setIsLoading(true);
    try {
      console.log("Selected quiz ID for deletion:", selectedQuizId);
      const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/quiz/quizzes/${selectedQuizId}`);
      refetch();
      toggleDeleteModal();
      console.log(res);
      toast.success("Quiz Deleted Successfully");
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      toast.error("Failed to delete quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (quizId) => {
    setSelectedQuizId(quizId);
    toggleDeleteModal();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleQuestionAnalysisClick = (quizId) => {
    console.log('Quiz ID:', quizId); // Debugging line
    navigate(`/questionAnalysis/${quizId}`); // Navigate to QuestionAnalysis page
  };

  return (
    <>
      <div className={styles.analyticsContainer}>
        <h1 className={styles.heading}>Quiz Analysis</h1>
        <div className={styles.tableContainer}>
          <table className={styles.analyticsTable}>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Quiz Name</th>
                <th>Created On</th>
                <th>Impressions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((quiz, index) => (
                  <tr
                    key={quiz.id}
                    className={index % 2 !== 0 ? styles.blueRow : ""}
                  >
                    <td>{index + 1}</td>
                    <td>{quiz.title}</td>
                    <td>{formatDate(quiz.createdAt)}</td>
                    <td>{quiz.impressions}</td>
                    <td className={styles.actions}>
                      <img src={EditIcon} alt="Edit" />
                      <img
                        src={DeleteIcon}
                        alt="Delete"
                        onClick={() => handleDeleteClick(quiz._id)} // Set selectedQuizId and open modal
                        style={{ cursor: "pointer" }}
                      />
                      <img
                        src={ShareIcon}
                        alt="Share"
                        onClick={() => copyLink(quiz._id)}
                        style={{ cursor: "pointer" }}
                      />
                      <button
                        className={styles.analysisLink}
                        onClick={() => handleQuestionAnalysisClick(quiz._id)} // Pass correct ID
                      >
                        Question Wise Analysis
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No quizzes available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
      </div>

      {deleteIsOpen && (
        <Title toggleModal={toggleDeleteModal}>
          <p className={styles.deleteWarning}>
            <p>Are you sure you</p><span>want to delete?</span>
          </p>

          <div className={styles.deleteActions}>
            <Button color="confirmDelete" onClick={() => handleQuizDelete()}>
              {isLoading ? "Deleting..." : "Confirm Delete"}
            </Button>
            <Button color="cancel" variant="outline" onClick={toggleDeleteModal}>
              Cancel
            </Button>
          </div>
        </Title>
      )}
    </>
  );
};

export default Index;

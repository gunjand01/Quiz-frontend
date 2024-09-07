import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupLabel } from '@headlessui/react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Button from '../../../components/Button';
import CustomInput from '../../../components/CustomInput';
import styles from './index.module.css';
import { QuizContext } from '../../../context/QuizProvider';
import { AuthContext } from '../../../context/AuthProvider';
import CreateQuizModal from './CreateQuizModal';

const dummyQuiz = {
  title: '',
  type: 'q&a',
};

export default function QuizModal({ defaultQuiz = dummyQuiz, onCancel, onContinue}) {
  console.log('onCancel:', onCancel); // Should log the closeModal function
  console.log('onContinue:', onContinue); 
  const [quiz, setQuiz] = useState(defaultQuiz);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const { addQuiz } = useContext(QuizContext);
  const { user } = useContext(AuthContext); // Assuming `user` is available from AuthContext
  const navigate = useNavigate();
  
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      console.log("clicked outside");
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel(); // Close the modal if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  useEffect(() => {
    if (!user || !user.token) {
      toast.error('Please log in to create a quiz.');
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  const handleAddQuiz = async () => {
    console.log('onContinue:', onContinue);
    if (onContinue) {
      onContinue();  // Make sure this line is calling the function passed down
    }
    console.log('User:', user);
    setIsLoading(true);
    try {
      if (!user || !user.token) {
        toast.error('You are not authenticated!');
        return;
      }

      const quizData = {
        ...quiz,
        userId: user.info._id,// Add the userId to the quiz object
      };

      console.log("Before calling addQuiz...", quizData);
      const result = await addQuiz(quizData); // Call to API to add the quiz

      console.log("Quiz added successfully:", result.quiz);
      toast.success('Successfully added quiz!');
      setShowCreateQuizModal(true);
      // onClose();
    } catch (err) {
      console.error(err.message); 
      // toast.error('Failed to add quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTitle = (value) => {
    setQuiz((prev) => ({ ...prev, title: value }));
  };

  const changeType = (type) => {
    setQuiz((prev) => ({ ...prev, type }));
  };

  const handleCancel = () => {
    console.log('Cancel button clicked'); // Test if this line runs
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      console.error('onCancel is not a function');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.input}>
          <CustomInput
            placeholder="Quiz Name"
            type="text"
            id="quizTitle"
            value={quiz.title}
            onChange={(e) => updateTitle(e.target.value)}
          />
        </div>

        <RadioGroup className={styles.radioGroup} value={quiz.type} onChange={changeType}>
          <RadioGroupLabel>
            Quiz Type 
          </RadioGroupLabel>

          <div className={styles.radioOptions}>
            <RadioGroup.Option value="q&a">
              {({ checked }) => (
                <div className={`${checked && styles.checkedOption} ${styles.radioOption}`}>
                  <p className={styles.type}>
                    Q & A
                  </p>
                </div>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="poll">
              {({ checked }) => (
                <div className={`${checked && styles.checkedOption} ${styles.radioOption}`}>
                  <p className={styles.type}>
                    POLL TYPE
                  </p>
                </div>
              )}
            </RadioGroup.Option>
          </div>
        </RadioGroup>

        <div className={styles.buttonGroup}>
          <Button color="cancel" variant="solid" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button color="success" variant="solid" onClick={handleAddQuiz} active={isLoading}>
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </div>

      {showCreateQuizModal && (
        <CreateQuizModal 
          defaultQuiz={dummyQuiz} 
          onClose={() => setShowCreateQuizModal(false)} 
          action="create" 
        />
      )}

    </div>
  );
}

QuizModal.propTypes = {
  defaultQuiz: PropTypes.shape({
    title: PropTypes.string,
    type: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired, // Mark onClose as required if it always needs to be provided
};
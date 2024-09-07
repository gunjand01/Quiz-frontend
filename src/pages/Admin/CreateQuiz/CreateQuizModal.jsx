import { useContext, useState } from 'react';
import { RadioGroup, RadioGroupLabel } from '@headlessui/react';
import { Trash } from 'lucide-react';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Button from '../../../components/Button';
import { QuizContext } from '../../../context/QuizProvider'; // Assuming you have a context for quizzes
import styles from './CreateQuizModal.module.css';

const dummyQuiz = {
  title: '',
  type: 'multiple-choice', // default type
  questions: [],
  timer: 0, // timer in seconds
};

export default function CreateQuizModal({
  defaultQuiz = dummyQuiz,
  onCancel, onCreateQuiz
}) {
  const [quiz, setQuiz] = useImmer(defaultQuiz);
  const { addQuiz, updateQuiz } = useContext(QuizContext); // Assuming you have a context for quizzes
  const [isLoading, setIsLoading] = useState(false);

  // DB and Context modifiers

  const handleCreateQuiz = async () => {
    setIsLoading(true);
    try {
      await addQuiz(quiz);
      onCreateQuiz();
      toast.success('Successfully created quiz!');
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  const handleUpdateQuiz = async () => {
    setIsLoading(true);
    try {
      await updateQuiz(quiz._id, quiz);
      onCreateQuiz();
      toast.success('Successfully updated quiz!');
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  // component state modifiers

  const updateTitle = (value) => {
    setQuiz((draft) => {
      draft.title = value;
    });
  };

  const changeQuizType = (type) => {
    setQuiz((draft) => {
      draft.type = type;
    });
  };

  const addQuestion = () => {
    setQuiz((draft) => {
      draft.questions.push({
        _id: uuidv4(),
        text: '',
        options: ['', '', '', ''], // Default 4 options
        correctAnswer: null, // Index of the correct answer for multiple-choice quizzes
      });
    });
  };

  const deleteQuestion = (id) => {
    setQuiz((draft) => {
      draft.questions = draft.questions.filter((question) => question._id !== id);
    });
  };

  const updateQuestionText = (questionId, value) => {
    setQuiz((draft) => {
      let question = draft.questions.find((q) => q._id === questionId);

      if (!question) return;

      question.text = value;
    });
  };

  const updateOptionText = (questionId, optionIndex, value) => {
    setQuiz((draft) => {
      let question = draft.questions.find((q) => q._id === questionId);

      if (!question) return;

      question.options[optionIndex] = value;
    });
  };

  const updateCorrectAnswer = (questionId, index) => {
    setQuiz((draft) => {
      let question = draft.questions.find((q) => q._id === questionId);

      if (!question) return;

      question.correctAnswer = index;
    });
  };

  const updateTimer = (value) => {
    setQuiz((draft) => {
      draft.timer = value;
    });
  };

  return (
    <div className={`${styles.container} ${styles.modalBackground}`}>
      <div className={styles.input}>
        <label htmlFor="quizTitle">
          Quiz Title <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          placeholder="Quiz Title"
          type="text"
          id="quizTitle"
          value={quiz.title}
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>

      <RadioGroup
        className={styles.radioGroup}
        value={quiz.type}
        onChange={changeQuizType}
      >
        <RadioGroupLabel>
          Select Quiz Type <span style={{ color: 'red' }}>*</span>
        </RadioGroupLabel>

        <div className={styles.radioOptions}>
          <RadioGroup.Option value="multiple-choice">
            {({ checked }) => (
              <div
                className={` ${checked && styles.checkedOption} ${
                  styles.radioOption
                }`}
              >
                <p className={styles.quizType}>Multiple Choice</p>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="poll">
            {({ checked }) => (
              <div
                className={` ${checked && styles.checkedOption} ${
                  styles.radioOption
                }`}
              >
                <p className={styles.quizType}>Poll</p>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="true-false">
            {({ checked }) => (
              <div
                className={` ${checked && styles.checkedOption} ${
                  styles.radioOption
                }`}
              >
                <p className={styles.quizType}>True/False</p>
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>

      <div className={styles.questions}>
        <p className={styles.questionsHeading}>
          Questions <span style={{ color: 'red' }}>*</span>
        </p>

        {/* {quiz.questions.map((question, questionIndex) => (
          <div key={question._id} className={styles.question}>
            <input
              type="text"
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) => updateQuestionText(question._id, e.target.value)}
              className={styles.questionInput}
            />
            {quiz.type === 'multiple-choice' && (
              <div className={styles.options}>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className={styles.option}>
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) =>
                        updateOptionText(question._id, optionIndex, e.target.value)
                      }
                      className={styles.optionInput}
                    />
                    <input
                      type="radio"
                      name={`correctAnswer-${question._id}`}
                      checked={question.correctAnswer === optionIndex}
                      onChange={() => updateCorrectAnswer(question._id, optionIndex)}
                    />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => deleteQuestion(question._id)}
              type="button"
              className={styles.deleteQuestion}
            >
              <Trash size={20} />
            </button>
          </div>
        ))} */}

        <div className={styles.addButton}>
          <Button onClick={addQuestion} variant="ghost">
            + Add New Question
          </Button>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <div className={styles.timerInput}>
          <label htmlFor="timer">
            Timer (in minutes) <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            id="timer"
            type="number"
            value={quiz.timer}
            onChange={(e) => updateTimer(e.target.value)}
            placeholder="Enter timer in minutes"
          />
        </div>

        <div className={styles.actions}>
          <Button variant="outline" color="error" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={ {onCreateQuiz} ? handleCreateQuiz : handleUpdateQuiz}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

CreateQuizModal.propTypes = {
  defaultQuiz: PropTypes.object,
  toggleModal: PropTypes.func,
  action: PropTypes.oneOf(['create', 'update']),
};

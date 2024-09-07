import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import styles from "./Sidebar.module.css";
import QuizModal from "./CreateQuiz/index"; // Adjust the path if necessary
import CreateQuizModal from "./CreateQuiz/CreateQuizModal";

export default function Navigation() {
  const { logout } = useContext(AuthContext);
  const [activeModal, setActiveModal] = useState(""); // Tracks the current active modal

  // Handlers for opening and closing modals
  const openFirstModal = () => {
    console.log("Opening First Modal");
    setActiveModal("first");
  };
  const openCreateQuizModal = () => {
    console.log("Setting activeModal to createQuiz");
    setActiveModal("createQuiz");
  };
  const openCongratsModal = () => setActiveModal("congrats");

    // Modal control functions
    const openModal = (modalName) => setActiveModal(modalName);
    const closeModal = () => setActiveModal("");
  

  const Logo = () => (
    <div className={styles.logo}>
      <p className={styles.heading}>QUIZZIE</p>
    </div>
  );

  // Navigation Links Component
const NavLinks = ({ onOpenModal }) => (
  <nav className={styles.links}>
    <NavLink
      to="/admin"
      className={({ isActive }) => (isActive ? styles.active : "")}
    >
      <p className={styles.title}>Dashboard</p>
    </NavLink>

    <NavLink
      to="/admin/analytics"
      className={({ isActive }) => (isActive ? styles.active : "")}
    >
      <p className={styles.title}>Analytics</p>
    </NavLink>

    <NavLink
      to="/admin/createQuiz"
      className={({ isActive }) => (isActive ? styles.active : "")}
      onClick={() => onOpenModal("first")}
    >
      <p className={styles.title}>Create Quiz</p>
    </NavLink>
  </nav>
);

// Logout Button Component
const LogoutButton = ({ onLogout }) => (
  <div className={styles.logout}>
    <p onClick={onLogout} className={styles.logoutText}>
      LOGOUT
    </p>
  </div>
);


// Modal Management Component
const Modals = ({ activeModal, onCloseModal, onOpenModal }) => (
  <>
    {activeModal === "first" && (
      <QuizModal
        onCancel={setActiveModal}
        onContinue={() => onOpenModal("createQuiz")}
      />
    )}

    {activeModal === "createQuiz" && (
      <CreateQuizModal
        defaultQuiz={{ title: "", type: "q&a" }}
        onCancel={() => onCloseModal()}
        onCreateQuiz={() => onOpenModal("congrats")}
      />
    )}

    {activeModal === "congrats" && (
      <div className={styles.congratsModal}>
        <p>Congratulations! Your quiz has been created.</p>
        <button onClick={onCloseModal}>Close</button>
      </div>
    )}
  </>
);

  
  return (
    <>
      <div className={styles.container}>
           <Logo />

           <NavLinks onOpenModal={openModal} />

           <LogoutButton onLogout={logout} />

           <Modals activeModal={activeModal} onCloseModal={closeModal} onOpenModal={openModal} />

      </div>
    </>
  );
}

import { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './layout.module.css';
// import { useContext, useEffect } from 'react';
// import { AuthContext } from '../../store/AuthProvider';

export default function AuthLayout() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       navigate('/');
//     }
//   }, [user, navigate]);

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#fff',
            color: 'black',
          },
        }}
      />

      <main className={styles.container}>
        <div className={styles.poster}>
          <p className={styles.heading}>
            QUIZZIE
          </p>
        </div>

        <div className={styles.outlet}>
          <Outlet />
        </div>
      </main>
    </>
  );
}
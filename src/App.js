import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import QuizProvider from './context/QuizProvider';
import Register from './pages/Auth/Register/register';
import Login from './pages/Auth/Login/login';
import AuthLayout from './pages/Auth/layout';
import AdminLayout from './pages/Admin/Layout';
import Quiz from './pages/Admin/Analytics/Quiz';
import CreateQuiz from './pages/Admin/CreateQuiz/index';
import Dashboard from './pages/Admin/Dashboard/index';
import Analytics from './pages/Admin/Analytics/index';
import QuestionAnalytics from './pages/Admin/Analytics/QuestionWiseAnalysis';

const router = createBrowserRouter([
  {
    path: '/',
    element: ( 
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [ 
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AuthProvider>
        <AdminLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: (
          <QuizProvider>
              <Dashboard />
          </QuizProvider>
        ),
      },
      {
        index: true,
        path: 'createQuiz',
        element: (
          <QuizProvider>
              <CreateQuiz />
          </QuizProvider>
        ),
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
    ],
  },
  {
    path: '/api/v1/quiz/question/:id',
    element: <Quiz/>
  },
  {
    path: '/questionAnalysis/:id',
    element: <QuestionAnalytics />
  }
])
function App() {
  return <RouterProvider router={router} />;
}

export default App;

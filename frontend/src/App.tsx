import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginPage,
  SignupPage,
  PagesRoutes,
  ProfilePage,
  VerifyAccountPage,
  ForgetPasswordPage,
  ResetPasswordPage
} from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from "./redux/store";
import { loadUser } from './redux/reducers/userSlice';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/sign-up" element={<SignupPage />} />
          <Route path="/auth/verification/*" element={<VerifyAccountPage />} />
          <Route path="/auth/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/auth/password-reset/:resetToken" element={<ResetPasswordPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />

          <Route path="/*" element={<PagesRoutes />} />

        </Routes>
      </BrowserRouter>


      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;

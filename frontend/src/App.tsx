import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, SignupPage, HomePage, ProfilePage, VerifyAccountPage, ForgetPasswordPage, ResetPasswordPage } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/verification:token" element={<VerifyAccountPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/password-reset/:resetToken" element={<ResetPasswordPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />

        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

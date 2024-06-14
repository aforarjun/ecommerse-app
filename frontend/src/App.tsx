import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginPage,
  SignupPage,
  VerifyAccountPage,
  ForgetPasswordPage,
  ResetPasswordPage,
  HomePage,
  ProductsPage,
  ProductDetailsPage,
  BestSellingPage,
  EventsPage,
  FaqsPage,
  ProfilePage,
  ErrorPage,
  CheckoutPage,
  SellerCreatePage,
  SellerLoginPage,
  SellerVerifyAccountPage,
  SellerForgetPasswordPage,
  SellerResetPasswordPage,
  SellerHomePage,
  SellerDashBoard,
  ShopPreviewPage
} from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './redux/store';
import { loadUser } from './redux/reducers/userSlice';
import { loadSeller } from './redux/reducers/sellerSlice';
import { ProtectedRoute, SellerProtectedRoute } from './routes';
import { getAllProducts } from './redux/reducers/productsSlice';
import { getAllEvents } from './redux/reducers/eventsSlice';

const App = () => {
  useEffect(() => {
    (async () => {
      await store.dispatch(getAllProducts());
      await store.dispatch(getAllEvents());

      await store.dispatch(loadUser());
      await store.dispatch(loadSeller());
    })();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* User auth pages */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/sign-up" element={<SignupPage />} />
          <Route path="/auth/verification/*" element={<VerifyAccountPage />} />
          <Route path="/auth/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/auth/password-reset/:resetToken" element={<ResetPasswordPage />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FaqsPage />} />

          <Route
            path="/profile/*"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout/*"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* Shop auth pages */}
          <Route path="/seller/create" element={<SellerCreatePage />} />
          <Route path="/seller/login" element={<SellerLoginPage />} />
          <Route path="/seller/verification/*" element={<SellerVerifyAccountPage />} />
          <Route path="/seller/forget-password" element={<SellerForgetPasswordPage />} />
          <Route path="/seller/password-reset/:resetToken" element={<SellerResetPasswordPage />} />

          <Route path="/shop/preview/:id/*" element={<ShopPreviewPage />} />

          <Route
            path="/seller/:id/*"
            element={
              <SellerProtectedRoute>
                <SellerHomePage />
              </SellerProtectedRoute>
            }
          />

          <Route
            path="/seller/dashboard/*"
            element={
              <SellerProtectedRoute>
                <SellerDashBoard />
              </SellerProtectedRoute>
            }
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="bottom-center"
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

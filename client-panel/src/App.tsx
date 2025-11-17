import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login2 from "./modules/auth/pages/Login2";
import Register2 from "./modules/auth/pages/Register2";
import ResetPassword from "./modules/auth/pages/ResetPassword";
import ResetPasswordConfirm from "./modules/auth/pages/ResetPasswordConfirm";
import NotificationSystem from "./shared/components/ui/NotificationSystem";
import { useNotifications } from "./shared/hooks/useNotifications";

function App() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Login2 />} />
          <Route path="/login" element={<Login2 />} />
          <Route path="/register" element={<Register2 />} />
          <Route path="/register2" element={<Register2 />} />
          <Route path="/login2" element={<Login2 />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset" element={<ResetPasswordConfirm />} />
        </Routes>
        <NotificationSystem
          notifications={notifications}
          onRemove={removeNotification}
        />
      </Router>
    </div>
  );
}

export default App;

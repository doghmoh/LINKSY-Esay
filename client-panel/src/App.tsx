import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNotifications } from "./hooks/useNotifications";
import NotificationSystem from "./components/ui/NotificationSystem";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restricted from "./pages/Restricted";
import ManageHosting from "./pages/Hosting/ManageHosting";
import ManageDomains from "./pages/Domains/ManageDomains";
import Register2 from "./pages/Register2";
import Login2 from "./pages/Login2";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import EmailTemplatesPreview from "./pages/EmailTemplatesPreview";
import SubscriptionDetails from "./pages/Facturation/SubscriptionDetails";

function App() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/restricted" element={<Restricted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register2" element={<Register2 />} />
          <Route path="/login2" element={<Login2 />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset" element={<ResetPasswordConfirm />} />
          <Route path="/email-templates" element={<EmailTemplatesPreview />} />
          <Route path="/hosting/manage" element={<ManageHosting />} />
          <Route path="/domains/manage" element={<ManageDomains />} />
          <Route
            path="/facturation/abonnements/:subId"
            element={<SubscriptionDetails />}
          />
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

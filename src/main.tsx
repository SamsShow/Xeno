import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { toast } from "sonner";
import App from "./App";
import { AuthCallback } from "./components/auth-callback";
import { CampaignList } from "./components/campaign-list";
import { CreateCampaign } from "./components/create-campaign";
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard";
import { CustomersList } from "./components/customers/CustomersList";
import { ProtectedRoute } from "./components/protected-route";
import { MessagesPage } from "./pages/messages";
import "./index.css";

// Add toast to window for access in other files
window.toast = toast;

// Create a wrapper component to handle navigation
const CampaignListWrapper = () => {
  const navigate = useNavigate();
  return <CampaignList onCreateNew={() => navigate("/campaigns/create")} />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/campaigns" replace />} />
          <Route
            path="campaigns"
            element={
              <ProtectedRoute>
                <CampaignListWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="campaigns/create"
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <ProtectedRoute>
                <CustomersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

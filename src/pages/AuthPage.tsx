
import React, { useEffect } from "react";
import { AuthForms } from "../components/AuthForms";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <AuthForms />
      </div>
    </div>
  );
};

export default AuthPage;

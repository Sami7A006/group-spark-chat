
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { GroupChatAndInfo } from "../components/GroupChatAndInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { selectGroup, userGroups, joinGroup } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!groupId) return;
    
    // Check if user is a member of the group
    const isMember = userGroups.some(group => group.id === groupId);
    
    // If user is a member, select the group
    if (isMember) {
      selectGroup(groupId);
    } else if (isAuthenticated) {
      // If user is authenticated but not a member, join the group
      joinGroup(groupId);
    } else {
      // If user is not authenticated, redirect to auth page
      navigate("/auth");
    }
    
    // Clean up when leaving the page
    return () => {
      selectGroup(null);
    };
  }, [groupId, selectGroup, userGroups, isAuthenticated, navigate, joinGroup]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
      
      <GroupChatAndInfo />
    </div>
  );
};

export default GroupPage;

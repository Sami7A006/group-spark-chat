
import React from "react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { GroupList } from "../components/GroupList";
import { CreateGroupDialog } from "../components/CreateGroupDialog";
import { Navigate } from "react-router-dom";

const MyGroupsPage: React.FC = () => {
  const { userGroups } = useData();
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Groups</h1>
          <p className="text-muted-foreground">Groups you've joined</p>
        </div>
        <CreateGroupDialog />
      </div>
      
      <GroupList groups={userGroups} />
    </div>
  );
};

export default MyGroupsPage;

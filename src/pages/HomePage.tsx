
import React from "react";
import { useData } from "../contexts/DataContext";
import { GroupList } from "../components/GroupList";
import { SearchAndFilter } from "../components/SearchAndFilter";
import { CreateGroupDialog } from "../components/CreateGroupDialog";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
  const { filteredGroups } = useData();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Discover Groups</h1>
          <p className="text-muted-foreground">Find and join groups based on your interests</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <SearchAndFilter />
          </div>
          {isAuthenticated && <CreateGroupDialog />}
        </div>
      </div>
      
      <GroupList groups={filteredGroups} />
    </div>
  );
};

export default HomePage;

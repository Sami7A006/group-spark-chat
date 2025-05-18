
import React from "react";
import { useData } from "../contexts/DataContext";
import { GroupList } from "../components/GroupList";
import { SearchAndFilter } from "../components/SearchAndFilter";

const ExplorePage: React.FC = () => {
  const { filteredGroups } = useData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Explore Groups</h1>
          <p className="text-muted-foreground">Discover new communities based on your interests</p>
        </div>
        <div className="w-full md:w-64">
          <SearchAndFilter />
        </div>
      </div>
      
      <GroupList groups={filteredGroups} />
    </div>
  );
};

export default ExplorePage;

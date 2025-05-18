
import React from "react";
import { Group } from "../types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

interface GroupCardProps {
  group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { joinGroup, userGroups } = useData();
  const { isAuthenticated } = useAuth();
  
  const isUserMember = userGroups.some(userGroup => userGroup.id === group.id);
  
  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    joinGroup(group.id);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={group.avatar} alt={group.name} />
            <AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl truncate">{group.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3 mb-3">
          {group.description}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          {group.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
        </div>
        {isUserMember ? (
          <Button asChild size="sm">
            <Link to={`/groups/${group.id}`}>Open</Link>
          </Button>
        ) : (
          <Button 
            size="sm"
            onClick={handleJoinClick}
            disabled={!isAuthenticated}
          >
            Join
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

interface GroupListProps {
  groups: Group[];
}

export const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  if (!groups.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No groups found</h3>
        <p className="text-muted-foreground">Try adjusting your search or create a new group!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};

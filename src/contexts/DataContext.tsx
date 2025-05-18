
import React, { createContext, useState, useContext, useEffect } from "react";
import { Group, GroupMember, Message } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface DataContextType {
  groups: Group[];
  filteredGroups: Group[];
  userGroups: Group[];
  setFilterQuery: (query: string) => void;
  activeGroup: Group | null;
  groupMembers: GroupMember[];
  messages: Message[];
  createGroup: (name: string, description: string, tags: string[]) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  selectGroup: (groupId: string | null) => void;
  sendMessage: (text: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "Photography Enthusiasts",
    description: "A group for sharing photography tips and showcasing your work.",
    tags: ["photography", "art", "creative"],
    createdBy: "1",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    memberCount: 24,
    avatar: "https://api.dicebear.com/6.x/identicon/svg?seed=photography"
  },
  {
    id: "2",
    name: "Fitness & Wellness",
    description: "Let's motivate each other to stay fit and healthy!",
    tags: ["fitness", "health", "workout"],
    createdBy: "2",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    memberCount: 42,
    avatar: "https://api.dicebear.com/6.x/identicon/svg?seed=fitness"
  },
  {
    id: "3",
    name: "Book Club",
    description: "Discussing great books across all genres.",
    tags: ["books", "reading", "literature"],
    createdBy: "1",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    memberCount: 18,
    avatar: "https://api.dicebear.com/6.x/identicon/svg?seed=books"
  }
];

const MOCK_MEMBERS: Record<string, GroupMember[]> = {
  "1": [
    { userId: "1", username: "demo", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Demo", isAdmin: true, joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { userId: "2", username: "john", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John", isAdmin: false, joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
  ],
  "2": [
    { userId: "2", username: "john", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John", isAdmin: true, joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
  ],
  "3": [
    { userId: "1", username: "demo", avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Demo", isAdmin: true, joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  ]
};

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      groupId: "1",
      userId: "1",
      username: "demo",
      userAvatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Demo",
      text: "Welcome to Photography Enthusiasts! Let's share our best shots here.",
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      groupId: "1",
      userId: "2",
      username: "john",
      userAvatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
      text: "Hi everyone! I'm excited to join this group. Recently got a new DSLR and looking forward to learning from you all.",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    }
  ],
  "2": [
    {
      id: "3",
      groupId: "2",
      userId: "2",
      username: "john",
      userAvatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
      text: "Welcome to Fitness & Wellness! Let's motivate each other to stay active and healthy.",
      timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
    }
  ],
  "3": [
    {
      id: "4",
      groupId: "3",
      userId: "1",
      username: "demo",
      userAvatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Demo",
      text: "Welcome to Book Club! Our first book of the month is 'The Midnight Library' by Matt Haig.",
      timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
    }
  ]
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>(MOCK_GROUPS);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filterQuery, setFilterQuery] = useState<string>("");
  
  // Update user groups whenever current user changes
  useEffect(() => {
    if (!currentUser) {
      setUserGroups([]);
      return;
    }
    
    // Find groups the user is a member of
    const userGroupIds = Object.keys(MOCK_MEMBERS).filter(groupId => 
      MOCK_MEMBERS[groupId].some(member => member.userId === currentUser.id)
    );
    
    const userGroupsData = groups.filter(group => userGroupIds.includes(group.id));
    setUserGroups(userGroupsData);
  }, [currentUser, groups]);
  
  // Apply filter to groups
  useEffect(() => {
    if (!filterQuery) {
      setFilteredGroups(groups);
      return;
    }
    
    const filtered = groups.filter(group => 
      group.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(filterQuery.toLowerCase()))
    );
    
    setFilteredGroups(filtered);
  }, [filterQuery, groups]);
  
  // Load group data when selecting a group
  useEffect(() => {
    if (!activeGroup) {
      setGroupMembers([]);
      setMessages([]);
      return;
    }
    
    setGroupMembers(MOCK_MEMBERS[activeGroup.id] || []);
    setMessages(MOCK_MESSAGES[activeGroup.id] || []);
  }, [activeGroup]);
  
  const selectGroup = (groupId: string | null) => {
    if (!groupId) {
      setActiveGroup(null);
      return;
    }
    
    const group = groups.find(g => g.id === groupId);
    setActiveGroup(group || null);
  };
  
  const createGroup = (name: string, description: string, tags: string[]) => {
    if (!currentUser) {
      toast.error("You must be logged in to create a group");
      return;
    }
    
    // Create new group
    const newGroup: Group = {
      id: `${groups.length + 1}`,
      name,
      description,
      tags,
      createdBy: currentUser.id,
      createdAt: new Date(),
      memberCount: 1,
      avatar: `https://api.dicebear.com/6.x/identicon/svg?seed=${name}`
    };
    
    // Add creator as member and admin
    const newMember: GroupMember = {
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      isAdmin: true,
      joinedAt: new Date()
    };
    
    // Update state
    setGroups(prev => [...prev, newGroup]);
    MOCK_MEMBERS[newGroup.id] = [newMember];
    MOCK_MESSAGES[newGroup.id] = [];
    
    // Select the new group
    setActiveGroup(newGroup);
    setUserGroups(prev => [...prev, newGroup]);
    
    toast.success("Group created successfully!");
  };
  
  const joinGroup = (groupId: string) => {
    if (!currentUser) {
      toast.error("You must be logged in to join a group");
      return;
    }
    
    const group = groups.find(g => g.id === groupId);
    if (!group) {
      toast.error("Group not found");
      return;
    }
    
    // Check if user is already a member
    if (MOCK_MEMBERS[groupId]?.some(member => member.userId === currentUser.id)) {
      toast.error("You are already a member of this group");
      return;
    }
    
    // Add user as a member
    const newMember: GroupMember = {
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      isAdmin: false,
      joinedAt: new Date()
    };
    
    // Update state
    MOCK_MEMBERS[groupId] = [...(MOCK_MEMBERS[groupId] || []), newMember];
    const updatedGroup = { ...group, memberCount: group.memberCount + 1 };
    
    setGroups(prev => prev.map(g => g.id === groupId ? updatedGroup : g));
    setUserGroups(prev => [...prev, updatedGroup]);
    setActiveGroup(updatedGroup);
    
    toast.success(`Joined ${group.name} successfully!`);
  };
  
  const leaveGroup = (groupId: string) => {
    if (!currentUser) {
      return;
    }
    
    const group = groups.find(g => g.id === groupId);
    if (!group) {
      return;
    }
    
    // Remove user from members
    MOCK_MEMBERS[groupId] = (MOCK_MEMBERS[groupId] || [])
      .filter(member => member.userId !== currentUser.id);
    
    // Update group member count
    const updatedGroup = { ...group, memberCount: Math.max(0, group.memberCount - 1) };
    
    setGroups(prev => prev.map(g => g.id === groupId ? updatedGroup : g));
    setUserGroups(prev => prev.filter(g => g.id !== groupId));
    
    // If active group is the one being left, unset it
    if (activeGroup?.id === groupId) {
      setActiveGroup(null);
    }
    
    toast.success(`Left ${group.name} successfully`);
  };
  
  const sendMessage = (text: string) => {
    if (!currentUser || !activeGroup) {
      return;
    }
    
    // Create new message
    const newMessage: Message = {
      id: `${Date.now()}`,
      groupId: activeGroup.id,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text,
      timestamp: new Date()
    };
    
    // Update state
    MOCK_MESSAGES[activeGroup.id] = [...(MOCK_MESSAGES[activeGroup.id] || []), newMessage];
    setMessages(prev => [...prev, newMessage]);
  };
  
  const value = {
    groups,
    filteredGroups,
    userGroups,
    setFilterQuery,
    activeGroup,
    groupMembers,
    messages,
    createGroup,
    joinGroup,
    leaveGroup,
    selectGroup,
    sendMessage
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

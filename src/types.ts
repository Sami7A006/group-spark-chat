
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  memberCount: number;
  avatar?: string;
}

export interface GroupMember {
  userId: string;
  username: string;
  avatar?: string;
  isAdmin: boolean;
  joinedAt: Date;
}

export interface Message {
  id: string;
  groupId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  timestamp: Date;
}

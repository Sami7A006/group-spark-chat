
import React, { useEffect, useRef, useState } from "react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export const GroupChatAndInfo: React.FC = () => {
  const { activeGroup, groupMembers, messages, sendMessage, leaveGroup } = useData();
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };
  
  if (!activeGroup) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Select a Group</h2>
          <p className="text-muted-foreground">Choose a group to view messages and members</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-[calc(100vh-8rem)] flex flex-col">
      {/* Group header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activeGroup.avatar} alt={activeGroup.name} />
            <AvatarFallback>{activeGroup.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{activeGroup.name}</h3>
            <p className="text-sm text-muted-foreground">
              {activeGroup.memberCount} {activeGroup.memberCount === 1 ? "member" : "members"}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => leaveGroup(activeGroup.id)}>
          Leave Group
        </Button>
      </div>

      {/* Tabs for chat and info */}
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="info">Members & Info</TabsTrigger>
        </TabsList>
        
        {/* Chat tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No messages yet. Be the first to say hello!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.userId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${msg.userId === currentUser?.id ? 'order-2' : 'order-1'}`}>
                      {msg.userId !== currentUser?.id && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={msg.userAvatar} alt={msg.username} />
                            <AvatarFallback>{msg.username?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{msg.username}</span>
                        </div>
                      )}
                      <div 
                        className={`p-3 rounded-lg ${
                          msg.userId === currentUser?.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSend} className="border-t p-4 flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!message.trim()}>Send</Button>
          </form>
        </TabsContent>
        
        {/* Info tab */}
        <TabsContent value="info" className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-lg mb-2">About</h4>
              <p className="text-muted-foreground">{activeGroup.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {activeGroup.tags.map((tag, index) => (
                  <Button key={index} variant="outline" size="sm" className="text-xs">
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-lg mb-2">Members ({groupMembers.length})</h4>
              <ul className="space-y-3">
                {groupMembers.map((member) => (
                  <li key={member.userId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.username} />
                        <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.username}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {member.isAdmin && (
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

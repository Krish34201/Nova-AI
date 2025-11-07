'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UsernameContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
  isLoading: boolean;
}

const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

export const UsernameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [inputUsername, setInputUsername] = useState('');

  useEffect(() => {
    try {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Could not access local storage:', error);
      setShowDialog(true); // Fallback to asking for username if local storage is blocked
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveUsername = () => {
    if (inputUsername.trim()) {
      try {
        localStorage.setItem('username', inputUsername.trim());
      } catch (error) {
        console.error('Could not save to local storage:', error);
      }
      setUsername(inputUsername.trim());
      setShowDialog(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveUsername();
    }
  };

  return (
    <UsernameContext.Provider value={{ username, setUsername, isLoading }}>
      {children}
      <Dialog open={showDialog}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Welcome to Nova AI</DialogTitle>
            <DialogDescription>
              Please enter a username to get started. Your conversations will be stored locally.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="col-span-3"
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveUsername} disabled={!inputUsername.trim()}>
              Save and Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UsernameContext.Provider>
  );
};

export const useUsername = () => {
  const context = useContext(UsernameContext);
  if (context === undefined) {
    throw new Error('useUsername must be used within a UsernameProvider');
  }
  return context;
};

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
  showUsernameDialog: boolean;
  setShowUsernameDialog: (show: boolean) => void;
}

const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

export const UsernameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [inputUsername, setInputUsername] = useState('');

  useEffect(() => {
    try {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        setShowUsernameDialog(false);
      } else {
        setShowUsernameDialog(true);
      }
    } catch (error) {
      console.error('Could not access local storage:', error);
      setShowUsernameDialog(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If loading is finished and there's no username, show the dialog.
    // This will trigger on initial load and after logout.
    if (!isLoading && !username) {
      setShowUsernameDialog(true);
    }
  }, [username, isLoading]);

  const handleSaveUsername = () => {
    if (inputUsername.trim()) {
      try {
        localStorage.setItem('username', inputUsername.trim());
      } catch (error) {
        console.error('Could not save to local storage:', error);
      }
      setUsername(inputUsername.trim());
      setInputUsername('');
      setShowUsernameDialog(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveUsername();
    }
  };

  return (
    <UsernameContext.Provider value={{ username, setUsername, isLoading, showUsernameDialog, setShowUsernameDialog }}>
      {children}
      <Dialog open={showUsernameDialog}>
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

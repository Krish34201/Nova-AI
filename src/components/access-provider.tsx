'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUsername } from './username-provider';
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

const SPECIAL_KEY = '08NOV2025';
const MAX_FREE_REQUESTS = 20;

interface AccessContextType {
  hasSpecialKey: boolean;
  requestCount: number;
  incrementRequestCount: () => void;
  limitExceeded: boolean;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { username, isLoading: isUsernameLoading, showUsernameDialog } = useUsername();
  
  const [hasSpecialKey, setHasSpecialKey] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [keyError, setKeyError] = useState<string | null>(null);

  // Effect to load access state from localStorage when username is available
  useEffect(() => {
    if (username) {
      setIsLoading(true);
      try {
        const storedKeyStatus = localStorage.getItem(`hasSpecialKey_${username}`);
        const storedRequestCount = localStorage.getItem(`requestCount_${username}`);
        const storedLastRequestDate = localStorage.getItem(`lastRequestDate_${username}`);
        const today = new Date().toISOString().split('T')[0];

        if (storedKeyStatus === 'true') {
          setHasSpecialKey(true);
          setShowKeyDialog(false);
        } else {
            // Only show dialog for the very first session
            if (storedKeyStatus === null) { 
                setShowKeyDialog(true);
            }
          
            if (storedLastRequestDate === today) {
                setRequestCount(Number(storedRequestCount) || 0);
            } else {
                // It's a new day, reset the count
                setRequestCount(0);
                localStorage.setItem(`requestCount_${username}`, '0');
                localStorage.setItem(`lastRequestDate_${username}`, today);
            }
        }
      } catch (error) {
        console.error('Could not access local storage for access state:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (!isUsernameLoading) {
        setIsLoading(false);
    }
  }, [username, isUsernameLoading]);

  // This effect manages the dialog flow, ensuring the key dialog appears after username dialog
  useEffect(() => {
    if (!showUsernameDialog && username && !hasSpecialKey) {
        try {
            const keyStatus = localStorage.getItem(`hasSpecialKey_${username}`);
            if (keyStatus === null) { // only show if it's never been set
                setShowKeyDialog(true);
            }
        } catch (error) {
            console.error(error);
        }
    }
  }, [showUsernameDialog, username, hasSpecialKey]);


  const handleKeyCheck = () => {
    const trimmedKey = inputKey.trim();
    if (trimmedKey === SPECIAL_KEY) {
      setKeyError(null);
      try {
        localStorage.setItem(`hasSpecialKey_${username}`, 'true');
      } catch (error) {
        console.error(error);
      }
      setHasSpecialKey(true);
      setShowKeyDialog(false);
    } else {
      setKeyError("WRONG!");
    }
  };

  const handleSkip = () => {
    // Only set 'false' if the user explicitly skips.
    // If they get the key wrong, the dialog should stay open.
    if (inputKey.trim() === '') {
        try {
            localStorage.setItem(`hasSpecialKey_${username}`, 'false');
        } catch (error) {
            console.error(error)
        }
        setHasSpecialKey(false);
        setShowKeyDialog(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleKeyCheck();
    }
  };

  const incrementRequestCount = () => {
    if (!hasSpecialKey) {
      const newCount = requestCount + 1;
      const today = new Date().toISOString().split('T')[0];
      setRequestCount(newCount);
      try {
        localStorage.setItem(`requestCount_${username}`, String(newCount));
        localStorage.setItem(`lastRequestDate_${username}`, today);
      } catch (error) {
          console.error(error);
      }
    }
  };

  const limitExceeded = !hasSpecialKey && requestCount >= MAX_FREE_REQUESTS;

  return (
    <AccessContext.Provider value={{ hasSpecialKey, requestCount, incrementRequestCount, limitExceeded }}>
      {children}
      <Dialog open={showKeyDialog}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Enter Special Key</DialogTitle>
            <DialogDescription>
              Enter a special key for unlimited access, or skip for limited free use (20 requests/day).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="special-key" className="text-right">
                Special Key
              </Label>
              <Input
                id="special-key"
                value={inputKey}
                onChange={(e) => {
                    setInputKey(e.target.value);
                    if (keyError) setKeyError(null);
                }}
                onKeyPress={handleKeyPress}
                className="col-span-3"
                placeholder="Optional"
                autoComplete="off"
              />
            </div>
            {keyError && (
                <p className="text-center text-sm text-destructive">{keyError}</p>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button onClick={handleKeyCheck} disabled={!inputKey.trim()}>
              Unlock Unlimited Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AccessContext.Provider>
  );
};

export const useAccess = () => {
  const context = useContext(AccessContext);
  if (context === undefined) {
    throw new Error('useAccess must be used within an AccessProvider');
  }
  return context;
};

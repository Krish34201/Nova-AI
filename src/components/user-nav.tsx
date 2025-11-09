"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUsername } from "@/components/username-provider"
import { Skeleton } from "./ui/skeleton"
import { LogOut } from "lucide-react"

export function UserNav() {
  const { username, setUsername, isLoading } = useUsername();

  const handleLogout = () => {
    if (username) {
        localStorage.removeItem(`chatHistory_${username}`);
        localStorage.removeItem('deviceId'); // Reset device ID to allow new key entry for new user
    }
    localStorage.removeItem('username');
    setUsername(null);
    // Reload to ensure all state is reset cleanly
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    )
  }

  if (!username) {
    return null; // Or a login button
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-auto rounded-full px-2 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="group-data-[collapsible=icon]:hidden">{username}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              Guest User
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

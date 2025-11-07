'use client'

import {
  MessageSquare,
  Bot,
  Code2,
  Book,
  Settings,
  CreditCard,
  LifeBuoy,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { NovaLogo } from '../nova-logo'
import { UserNav } from '../user-nav'
import { Separator } from '../ui/separator'
import Link from 'next/link'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b">
        <div className="flex items-center gap-2">
          <NovaLogo />
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Nova AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2 flex-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive tooltip="Chat">
              <Link href="#">
                <MessageSquare />
                <span>Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="AI Agents">
              <Link href="#">
                <Bot />
                <span>AI Agents</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Tools">
              <Link href="#">
                <Code2 />
                <span>Tools</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Memory">
              <Link href="#">
                <Book />
                <span>Memory</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Support">
              <Link href="#">
                <LifeBuoy />
                <span>Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-2" />
        <div className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <UserNav />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

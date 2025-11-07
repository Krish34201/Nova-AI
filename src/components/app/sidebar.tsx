'use client'

import {
  MessageSquare,
  Bot,
  Book,
  Lightbulb,
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
import { usePathname } from 'next/navigation'

export function AppSidebar() {
  const pathname = usePathname();

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
            <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Chat">
              <Link href="/">
                <MessageSquare />
                <span>Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/agents'} tooltip="AI Agents">
              <Link href="/agents">
                <Bot />
                <span>AI Agents</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/inspirations'} tooltip="Quotes">
              <Link href="/inspirations">
                <Lightbulb />
                <span>Quotes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/memory'} tooltip="Memory">
              <Link href="/memory">
                <Book />
                <span>Memory</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <UserNav />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

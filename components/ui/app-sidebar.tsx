'use client'
import { Calendar, Home, Search, Settings } from "lucide-react"
import { createClient } from "@/utils/supabase/client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import Link from "next/link";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Today",
    url: "/home",
    icon: Home,
  },
  {
    title: "Past Days",
    url: "/home/history",
    icon: Calendar,
  },
]

export function AppSidebar() {
  const supabase = createClient();
  const [user, setUser] = useState(false)
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      if (response.data.user) {
        setUser(true);
      }
    });

  }, [])

  if (!user) {
    return <></>;
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Currently Spending</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

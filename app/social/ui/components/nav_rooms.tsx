'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#common/ui/components/sidebar'
import React from 'react'
import { CreateRoomDialog } from './create_room_dialog'
import usePageProps from '#common/ui/hooks/use_page_props'
import Room from '#social/models/room'
import { Link } from '@inertiajs/react'
import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import useParams from '#common/ui/hooks/use_params'
import { cn } from '#common/ui/lib/utils'

export function NavRooms({ rooms, title }: { rooms: Room[]; title: string }) {
  const params = useParams()
  const { route } = usePageProps<{ route: string }>()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {rooms.map((room) => (
          <SidebarMenuItem key={room.name}>
            <SidebarMenuButton asChild>
              <Link
                className={cn(
                  params.roomId === room.id &&
                    route === 'rooms.show' &&
                    'font-medium text-black bg-sidebar-accent'
                )}
                href={`/rooms/${room.id}`}
              >
                <Avatar className="h-6 w-6 rounded-lg border">
                  <AvatarImage src={`https://avatar.vercel.sh/${room.id}?`} alt={room.name} />
                </Avatar>
                <span className="text-sidebar-foreground">{room.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

        <SidebarMenuItem>
          <CreateRoomDialog />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

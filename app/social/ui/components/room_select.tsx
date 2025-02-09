import { Avatar, AvatarFallback, AvatarImage } from '#common/ui/components/avatar'
import { Label } from '#common/ui/components/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'
import usePageProps from '#common/ui/hooks/use_page_props'
import useTranslate from '#common/ui/hooks/use_translate'
import Room from '#social/models/room'
import React from 'react'
import { RoomLogo } from './room_logo'

export type RoomSelectProps = {
  rooms: Room[]
  roomSlug: string
  setRoomSlug: (roomSlug: string) => void
}

export default function RoomSelect({ roomSlug, setRoomSlug, rooms }: RoomSelectProps) {
  const t = useTranslate('social')
  const room = rooms.find((room) => room.slug === roomSlug)
  return (
    <div className="grid gap-2">
      <Label htmlFor="roomSlug">{t('select_a_room')}</Label>
      <Select name="roomSlug" value={roomSlug} onValueChange={setRoomSlug}>
        <SelectTrigger className="w-auto">
          <div className="flex items-center space-x-2 pr-2">
            {room ? <RoomLogo room={room} className="h-6 w-6" /> : null}

            <SelectValue placeholder={t('select_a_room')} />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('select_a_room')}</SelectLabel>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.slug}>
                {room.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

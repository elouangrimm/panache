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
import { ArrowDownWideNarrowIcon } from 'lucide-react'
import React from 'react'

export type RoomSelectProps = {
  roomId: string
  setRoomId: (roomId: string) => void
}

export default function RoomSelect({ roomId, setRoomId }: RoomSelectProps) {
  const { rooms } = usePageProps<{ rooms: Room[] }>()
  const t = useTranslate('social')
  return (
    <div className="grid gap-2">
      <Label htmlFor="roomId">{t('select_a_room')}</Label>
      <Select name="roomId" value={roomId} onValueChange={setRoomId}>
        <SelectTrigger className="w-auto">
          <div className="flex items-center space-x-2 pr-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://avatar.vercel.sh/${roomId}`} />
            </Avatar>
            <SelectValue placeholder={t('select_a_room')} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('select_a_room')}</SelectLabel>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

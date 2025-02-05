import useTranslate, { useLocale } from '#common/ui/hooks/use_translate'
import { cn } from '#common/ui/lib/utils'
import Room from '#social/models/room'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, GlobeIcon, Users2Icon } from 'lucide-react'
import React from 'react'

export function RoomInfo({ header, room }: { room: Room; header?: React.ReactElement }) {
  const locale = useLocale()
  const t = useTranslate()
  const timeAgo = formatDistanceToNow(new Date(room.createdAt as unknown as string), {
    addSuffix: true,
    locale: locale === 'fr' ? fr : undefined,
  })

  return (
    <div className="flex flex-col justify-between rounded-lg bg-[#f0eee6]/50 border p-3 text-sm min-h-32">
      {header}
      <p className={cn('text-foreground font-medium', header && 'pt-4')}>{room.description}</p>
      <div>
        <div className="flex gap-x-1 items-center text-muted-foreground pt-2">
          <GlobeIcon className="h-4 w-4" />
          <span>Public</span>
        </div>
        <div className="flex gap-x-1 items-center text-muted-foreground pt-2">
          <Users2Icon className="h-4 w-4" />
          <span>
            {room.memberCount} {room.memberCount > 1 ? t('social.members') : t('social.member')}
          </span>
        </div>
        <div className="flex gap-x-1 items-center text-muted-foreground pt-2">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {t('common.created')} {timeAgo}
          </span>
        </div>
      </div>
    </div>
  )
}

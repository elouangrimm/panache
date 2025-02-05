import { Avatar, AvatarFallback, AvatarImage } from '#common/ui/components/avatar'
import { Button } from '#common/ui/components/button'
import useTranslate, { useLocale } from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import post from '#social/models/post'
import Room from '#social/models/room'
import { PostActions } from '#social/ui/components/post_actions'
import { RoomInfo } from '#social/ui/components/room_info'
import SocialLayout from '#social/ui/components/social_layout'
import { Link } from '@inertiajs/react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'

export default function Show({
  room,
  post,
  isMember,
}: {
  room: Room
  post: Post
  isMember: boolean
}) {
  const t = useTranslate()
  const locale = useLocale()
  const timeAgo = formatDistanceToNow(new Date(post.createdAt as unknown as string), {
    addSuffix: true,
    locale: locale === 'fr' ? fr : undefined,
  })
  return (
    <SocialLayout>
      <main className="max-w-6xl mx-auto w-full p-4">
        <div className="grid grid-cols-4 gap-x-4 pt-6 px-4">
          <div className="col-span-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${post.user.id}`}
                    alt={post.user.username}
                  />
                  <AvatarFallback>{post.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="">
                  <div className="flex items-center gap-1 text-sm">
                    <Link
                      className="font-medium hover:text-emerald-700 transition-colors"
                      href={`/rooms/${room.id}`}
                    >
                      {room.name}
                    </Link>

                    <span className="text-muted-foreground">• {timeAgo}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{post.user.username}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <h2 className="font-medium text-2xl pt-4">{post.title}</h2>
            <div className="pt-2">
              <PostActions post={post} />
            </div>
          </div>
          <div className="col-span-1">
            <RoomInfo room={room} />
          </div>
        </div>
      </main>
    </SocialLayout>
  )
}

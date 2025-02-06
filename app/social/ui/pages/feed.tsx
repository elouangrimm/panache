import React from 'react'
import SocialLayout from '../components/social_layout'
import { SortBySelect } from '../components/sort_by_select'
import { Button } from '#common/ui/components/button'
import Room from '#social/models/room'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MoreHorizontal } from 'lucide-react'
import { PostCard } from '../components/post_card'
import { useLocale } from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import { Link } from '@inertiajs/react'

export default function Landing({ room, posts }: { room: Room; posts: Post[] }) {
  const locale = useLocale()
  return (
    <SocialLayout>
      <div className="p-4 max-w-6xl mx-auto w-full">
        <SortBySelect />
        <div className="pt-4 grid gap-y-4">
          {posts.map(function (post) {
            const timeAgo = formatDistanceToNow(new Date(post.createdAt as unknown as string), {
              addSuffix: true,
              locale: locale === 'fr' ? fr : undefined,
            })
            return (
              <PostCard
                key={post.id}
                post={post}
                room={post.room}
                header={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link
                        className="h-6 w-6 hover:opacity-75 transition-opacity"
                        href={`/rooms/${post.roomId}`}
                      >
                        <Avatar>
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${post.roomId}?rounded=60`}
                            alt={post.roomId}
                          />
                          <AvatarFallback>{post.roomId.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex items-center gap-1 text-[13px]">
                        <Link
                          className="font-medium hover:text-emerald-600 transition-colors"
                          href={`/rooms/${post.roomId}`}
                        >
                          {post.room.name}
                        </Link>
                        <span className="text-muted-foreground">• {timeAgo}</span>
                      </div>
                    </div>
                  </div>
                }
              />
            )
          })}
        </div>
      </div>
    </SocialLayout>
  )
}

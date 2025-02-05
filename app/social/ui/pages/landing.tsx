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
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${post.user.username}`}
                          alt={post.user.username}
                        />
                        <AvatarFallback>
                          {post.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1 text-[13px]">
                        <span className="font-medium">{post.user.username}</span>
                        <span className="text-muted-foreground">• {timeAgo}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
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

import React from 'react'
import SocialLayout from '../components/social_layout'
import { SortBySelect } from '../components/sort_by_select'
import Room from '#social/models/room'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { PostCard } from '../components/post_card'
import Post from '#social/models/post'
import { Link } from '@inertiajs/react'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'

export default function Landing({ room, posts }: { room: Room; posts: Post[] }) {
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <SocialLayout>
      <SortBySelect />
      <div className="pt-4 grid gap-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            room={post.room}
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    className="hover:opacity-75 transition-opacity"
                    href={`/rooms/${post.roomId}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${post.roomId}?rounded=100`}
                        alt={post.roomId}
                        width={32}
                        height={32}
                      />
                    </Avatar>
                  </Link>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-[13px]">
                      <Link
                        className="font-medium hover:text-emerald-600 transition-colors"
                        href={`/rooms/${post.roomId}`}
                      >
                        {post.room.name}
                      </Link>
                      <span className="text-muted-foreground">
                        • {formatDistanceToNow(post.createdAt as unknown as string)}
                      </span>
                    </div>

                    <div className="flex">
                      <Link
                        className="text-xs text-muted-foreground hover:text-emerald-800 transition-colors"
                        href={`/profiles/${post.profile.username}`}
                      >
                        {post.profile.username}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        ))}
      </div>
    </SocialLayout>
  )
}

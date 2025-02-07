import { Avatar, AvatarFallback, AvatarImage } from '#common/ui/components/avatar'
import { buttonVariants } from '#common/ui/components/button'
import useTranslate from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import Room from '#social/models/room'
import { PostCard } from '#social/ui/components/post_card'
import SocialLayout from '#social/ui/components/social_layout'
import { SortBySelect } from '#social/ui/components/sort_by_select'
import { Link } from '@inertiajs/react'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { RoomInfo } from '#social/ui/components/room_info'
import { JoinRoomButton } from '#social/ui/components/join_room_button'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { cn } from '#common/ui/lib/utils'

export default function Show({ room, posts }: { room: Room; posts: Post[] }) {
  const formatDistanceToNow = useFormatDistanceToNow()
  const t = useTranslate()

  return (
    <SocialLayout>
      <header>
        <div className="h-24 bg-[#e3e2d4] rounded-lg border border-sidebar"></div>
        <div className="flex flex-wrap gap-x-2 items-center justify-between pt-3 px-4">
          <div className="flex items-start gap-x-4 w-full">
            <Avatar className="h-24 w-24 rounded-full -mt-10 border-4 border-white">
              <AvatarImage src={`https://avatar.vercel.sh/${room.id}?rounded=60`} alt={room.name} />
            </Avatar>

            <div>
              <p className="font-mono font-semibold uppercase text-sm">{t('social.room')}</p>
              <h2 className="text-3xl font-medium font-serif">{room.name}</h2>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-y-0 pt-4 sm:pt-0 ml-auto">
              <Link
                className={cn(buttonVariants({ variant: 'secondary' }), '!w-full sm:!w-auto')}
                href={`/create?room=${room.id}`}
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span>{t('social.create_a_post')}</span>
              </Link>
              <JoinRoomButton />
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-4 gap-4 pt-6 px-4 w-full">
        <div className="col-span-3">
          <SortBySelect />

          <div className="pt-4 grid gap-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                room={room}
                header={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link
                        className="hover:opacity-75 transition-opacity"
                        href={`/profiles/${post.user.username}`}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${post.user.username}`}
                            alt={post.user.username}
                          />
                        </Avatar>
                      </Link>

                      <div className="flex items-center gap-1 text-[13px]">
                        <Link
                          className="hover:text-emerald-900 transition-colors font-medium"
                          href={`/profiles/${post.user.username}`}
                        >
                          {post.user.username}
                        </Link>

                        <span className="text-muted-foreground">
                          • {formatDistanceToNow(post.createdAt as unknown as string)}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
        <div className="col-span-1 w-full pb-4 sm:pb-0">
          <RoomInfo room={room} />
        </div>
      </div>
    </SocialLayout>
  )
}

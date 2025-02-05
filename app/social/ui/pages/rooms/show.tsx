import { Avatar, AvatarFallback, AvatarImage } from '#common/ui/components/avatar'
import { Button, buttonVariants } from '#common/ui/components/button'
import useTranslate, { useLocale } from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import Room from '#social/models/room'
import { PostCard } from '#social/ui/components/post_card'
import SocialLayout from '#social/ui/components/social_layout'
import { SortBySelect } from '#social/ui/components/sort_by_select'
import { Link, useForm } from '@inertiajs/react'
import { formatDistanceToNow } from 'date-fns'
import { CalendarIcon, GlobeIcon, MoreHorizontal, PlusCircleIcon, Users2Icon } from 'lucide-react'
import React from 'react'
import { fr } from 'date-fns/locale'
import { RoomInfo } from '#social/ui/components/room_info'

export default function Show({
  room,
  posts,
  isMember,
}: {
  room: Room
  posts: Post[]
  isMember: boolean
}) {
  const locale = useLocale()

  const t = useTranslate()
  const form = useForm()

  const handleJoin = () => {
    form.post(`/rooms/${room.id}/join`)
  }
  const handleQuit = () => {
    form.post(`/rooms/${room.id}/quit`)
  }

  return (
    <SocialLayout>
      <main className="max-w-6xl mx-auto w-full p-4">
        <header>
          <div className="h-20 bg-[#e3e2d4] rounded-lg border"></div>
          <div className="flex gap-x-2 items-center justify-between pt-4 px-4">
            <div className="flex items-start gap-x-4">
              <Avatar className="h-18 w-18 rounded-full -mt-8 border-4 border-white">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${room.id}?rounded=60`}
                  alt={room.name}
                />
              </Avatar>
              <h2 className="text-3xl font-medium font-serif">{room.name}</h2>
            </div>
            <div className="flex gap-x-2">
              <Link
                className={buttonVariants({ variant: 'secondary' })}
                href={`/create?room=${room.id}`}
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span>{t('social.create_a_post')}</span>
              </Link>
              {isMember ? (
                <Button variant="danger" onClick={handleQuit}>
                  {t('common.quit')}
                </Button>
              ) : (
                <Button onClick={handleJoin}>{t('common.join')}</Button>
              )}
            </div>
          </div>
        </header>
        <div className="grid grid-cols-4 gap-x-4 pt-6 px-4">
          <div className="col-span-3">
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
                    room={room}
                    header={
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${post.user.id}`}
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
          <div className="col-span-1">
            <RoomInfo room={room} />
          </div>
        </div>
      </main>
    </SocialLayout>
  )
}

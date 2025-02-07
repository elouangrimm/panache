import React from 'react'
import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import useTranslate from '#common/ui/hooks/use_translate'
import { PostCard } from '#social/ui/components/post_card'
import SocialLayout from '#social/ui/components/social_layout'
import User from '#common/models/user'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#common/ui/components/tabs'
import { CommentCard } from '../components/comment_card'
import { Link } from '@inertiajs/react'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { AvatarFallback } from '@radix-ui/react-avatar'

export default function Profile({ profile }: { profile: User }) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <SocialLayout>
      <main className="max-w-6xl mx-auto w-full p-4">
        <header>
          <div className="h-24 bg-[#e3e2d4] rounded-lg border border-sidebar"></div>
          <div className="flex flex-wrap gap-x-2 items-center justify-between pt-3 px-4">
            <div className="flex items-start gap-x-4">
              <Avatar className="h-24 w-24 rounded-full -mt-10 border-4 border-white">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${profile.username}?rounded=60`}
                  alt={profile.username}
                />
              </Avatar>
              <div>
                <p className="font-mono font-semibold uppercase text-sm">{t('social.profile')}</p>
                <h2 className="text-3xl font-medium font-serif">{profile.username}</h2>
              </div>
            </div>
          </div>
        </header>
        <Tabs defaultValue="posts" className="min-w-full mt-8">
          <TabsList className="grid w-full grid-cols-2 gap-x-4">
            <TabsTrigger value="posts">{t('social.posts')}</TabsTrigger>
            <TabsTrigger value="comments">{t('social.comments')}</TabsTrigger>
          </TabsList>

          <TabsContent className="w-full pt-4 grid gap-y-4" value="posts">
            {profile.posts.map((post) => (
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
                    </div>
                  </div>
                }
              />
            ))}
          </TabsContent>

          <TabsContent className="w-full pt-4" value="comments">
            {profile.comments.map((comment) => (
              <CommentCard
                key={comment.id}
                post={comment.post}
                comment={comment}
                hideReply
                header={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link
                        className="hover:opacity-75 transition-opacity"
                        href={`/rooms/${comment.post.room.id}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${comment.post.room.id}?rounded=100`}
                            alt={comment.post.room.id}
                            width={32}
                            height={32}
                          />
                        </Avatar>
                      </Link>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-[13px]">
                          <Link
                            className="font-medium hover:text-emerald-600 transition-colors"
                            href={`/rooms/${comment.post.room.id}`}
                          >
                            {comment.post.room.name}
                          </Link>
                          <Link
                            className="font-medium text-muted-foreground hover:text-emerald-600 transition-colors truncate"
                            href={`/rooms/${comment.post.room.id}`}
                          >
                            • {comment.post.title}
                          </Link>
                        </div>

                        <p className="text-muted-foreground text-xs">
                          <span className="text-black font-medium">{profile.username}</span>{' '}
                          {t('social.commented')}{' '}
                          {formatDistanceToNow(comment.createdAt as unknown as string)}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </SocialLayout>
  )
}

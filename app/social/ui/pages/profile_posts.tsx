import React from 'react'
import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import useTranslate from '#common/ui/hooks/use_translate'
import { PostCard } from '#social/ui/components/post_card'
import SocialLayout from '#social/ui/components/social_layout'
import User from '#common/models/user'
import { Link } from '@inertiajs/react'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { ProfileTabs } from '../components/profile_tabs'
import { ProfileHeader } from '../components/profile_header'

export default function ProfilePosts({ profile }: { profile: User }) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <SocialLayout>
      <div className="space-y-8">
        <ProfileHeader profile={profile} />
        <ProfileTabs resource="posts" />

        <div className="flex flex-col space-y-4">
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
        </div>
      </div>
    </SocialLayout>
  )
}

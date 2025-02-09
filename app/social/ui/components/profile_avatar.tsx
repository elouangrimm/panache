import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import { cn } from '#common/ui/lib/utils'
import Profile from '#social/models/profile'
import { AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'

export type ProfileAvatarProps = {
  className?: string
  profile: Profile
}

export function ProfileAvatar({ className, profile }: ProfileAvatarProps) {
  return (
    <Avatar className={cn('border shadow-xs', className)}>
      <AvatarImage
        className="aspect-square object-cover"
        src={profile.avatar || `https://avatar.vercel.sh/${profile.username}`}
        alt={profile.username}
      />
      <AvatarFallback className="rounded-lg">@{profile.username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

import User from '#common/models/user'
import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import useTranslate from '#common/ui/hooks/use_translate'
import React from 'react'

export function ProfileHeader({ profile }: { profile: User }) {
  const t = useTranslate()

  return (
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
  )
}

'use client'

import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import useTranslate from '#common/ui/hooks/use_translate'
import Profile from '#social/models/profile'
import { Camera } from 'lucide-react'
import React from 'react'
import { useRef, useState } from 'react'

export function ProfileHeader({ profile }: { profile: Profile }) {
  const t = useTranslate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarSrc, setAvatarSrc] = useState(
    `https://avatar.vercel.sh/${profile.username}?rounded=60`
  )

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <header>
      <div className="h-24 bg-[#e3e2d4] rounded-lg border border-sidebar"></div>
      <div className="flex flex-wrap gap-x-2 items-center justify-between pt-3 px-4 max-w-4xl mx-auto">
        <div className="flex items-start gap-x-4">
          <div className="relative -mt-10">
            <Avatar className="h-24 w-24 rounded-full border-4 border-white">
              <AvatarImage
                className="aspect-square object-cover"
                src={avatarSrc}
                alt={profile.username}
              />
            </Avatar>
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change avatar</span>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div>
            <p className="font-mono font-semibold uppercase text-sm">{t('social.profile')}</p>
            <h2 className="text-3xl font-medium font-serif">{profile.username}</h2>
          </div>
        </div>
      </div>
    </header>
  )
}

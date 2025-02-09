import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '#common/ui/components/dropdown-menu'
import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'
import { Link } from '@inertiajs/react'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { CircleUserRoundIcon } from 'lucide-react'
import React from 'react'
import { ProfileAvatar } from './profile_avatar'

interface SocialDropdownProps {}

export const SocialDropdown: React.FunctionComponent<SocialDropdownProps> = () => {
  const t = useTranslate('social')
  const user = useUser()
  if (!user) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:opacity-75 transition-opacity">
        <ProfileAvatar profile={user.currentProfile} className="h-9 w-9 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <DropdownMenuLabel>Social</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/profiles/${user.currentProfile.username}`}>
            <DropdownMenuItem>
              <CircleUserRoundIcon className="h-4 w-4" />
              <span>{t('view_my_profile')}</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

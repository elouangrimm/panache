import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '#common/ui/components/dropdown-menu'
import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'
import { useProfiles } from '#social/ui/hooks/use_profiles'
import { Link, useForm } from '@inertiajs/react'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { CircleUserRoundIcon, UserPlusIcon, ArrowRightLeft } from 'lucide-react'
import { ProfileAvatar } from './profiles/profile_avatar'
import { CreateProfileDialog } from './profiles/create_profile_dialog'
import Profile from '#social/models/profile'

export const SocialDropdown: React.FunctionComponent = () => {
  const t = useTranslate()
  const user = useUser()
  const profiles = useProfiles()
  const [showCreateProfileDialog, setShowCreateProfileDialog] = React.useState(false)

  if (!user) return null

  return (
    <>
      <CreateProfileDialog open={showCreateProfileDialog} setOpen={setShowCreateProfileDialog} />
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
                <CircleUserRoundIcon className="h-4 w-4 mr-2" />
                <span>{t('social.view_my_profile')}</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                <span>{t('social.switch_profile')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {profiles
                  .filter((profile) => profile.id !== user.currentProfileId)
                  .map((profile) => (
                    <SwitchProfile profile={profile} />
                  ))}
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setShowCreateProfileDialog(true)}>
                  <UserPlusIcon className="h-4 w-4" />
                  <span>{t('social.create_new_profile')}</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

function SwitchProfile({ profile }: { profile: Profile }) {
  const switchForm = useForm()
  return (
    <DropdownMenuItem
      key={profile.id}
      className="flex items-center"
      onClick={() => {
        switchForm.post(`/profiles/${profile.id}/switch`)
      }}
    >
      <ProfileAvatar profile={profile} className="h-6 w-6" />
      <span>{profile.username}</span>
    </DropdownMenuItem>
  )
}

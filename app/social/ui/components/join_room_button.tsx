import { Button } from '#common/ui/components/button'
import usePageProps from '#common/ui/hooks/use_page_props'
import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'
import Room from '#social/models/room'
import { useForm } from '@inertiajs/react'
import React from 'react'

export function JoinRoomButton() {
  const { isMember, room } = usePageProps<{ isMember: boolean; room: Room }>()
  const form = useForm()
  const t = useTranslate()
  const user = useUser()

  const handleJoin = () => {
    form.post(`/rooms/${room.slug}/join`)
  }

  const handleQuit = () => {
    form.post(`/rooms/${room.slug}/quit`)
  }

  if (isMember) {
    return (
      <Button variant="danger" onClick={handleQuit}>
        {t('common.quit')}
      </Button>
    )
  }

  return (
    <Button onClick={handleJoin} disabled={!user}>
      {t('common.join')}
    </Button>
  )
}

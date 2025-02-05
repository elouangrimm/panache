import { Button } from '#common/ui/components/button'
import usePageProps from '#common/ui/hooks/use_page_props'
import useTranslate from '#common/ui/hooks/use_translate'
import Room from '#social/models/room'
import { useForm } from '@inertiajs/react'
import React from 'react'

export function JoinRoomButton() {
  const { isMember, room } = usePageProps<{ isMember: boolean; room: Room }>()
  const form = useForm()
  const t = useTranslate()

  const handleJoin = () => {
    form.post(`/rooms/${room.id}/join`)
  }

  const handleQuit = () => {
    form.post(`/rooms/${room.id}/quit`)
  }

  if (isMember) {
    return (
      <Button variant="danger" onClick={handleQuit}>
        {t('common.quit')}
      </Button>
    )
  }

  return <Button onClick={handleJoin}>{t('common.join')}</Button>
}

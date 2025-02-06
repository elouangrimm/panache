import React from 'react'
import SocialLayout from '../components/social_layout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '#common/ui/components/tabs'
import useTranslate from '#common/ui/hooks/use_translate'
import { Label } from '#common/ui/components/label'
import { Input } from '#common/ui/components/input'
import { Button } from '#common/ui/components/button'
import { Textarea } from '#common/ui/components/textarea'
import usePageProps from '#common/ui/hooks/use_page_props'
import Room from '#social/models/room'
import { useForm } from '@inertiajs/react'
import RoomSelect from '../components/room_select'
import Error from '#common/ui/components/error'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Create() {
  const { rooms } = usePageProps<{ rooms: Room[] }>()
  const { query } = usePageProps<{ query: Record<string, string> }>()
  const [roomId, setRoomId] = React.useState(query.room || rooms[0].id)
  const form = useForm({
    title: '',
    text: '',
    link: '',
  })
  const t = useTranslate('social')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post(`/rooms/${roomId}/posts`)
  }

  return (
    <SocialLayout>
      <main className="max-w-6xl w-full mx-auto">
        <h1 className="text-5xl font-serif sm:pt-8">{t('create_a_post')}</h1>

        <form className="flex flex-col space-y-8 pt-8" onSubmit={handleSubmit}>
          <RoomSelect roomId={roomId} setRoomId={setRoomId} />

          <Tabs defaultValue="text" className="min-w-full">
            <TabsList className="grid w-full grid-cols-4 gap-x-4">
              <TabsTrigger value="text">{t('text')}</TabsTrigger>
              <TabsTrigger value="image">{t('image')}</TabsTrigger>
              <TabsTrigger value="link">{t('link')}</TabsTrigger>
              <TabsTrigger value="meme">{t('meme')}</TabsTrigger>
            </TabsList>

            <div className="grid gap-2 pt-8 pb-2">
              <Label htmlFor="title">{t('title')}</Label>
              <Input
                autoComplete="off"
                id="title"
                name="title"
                type="text"
                placeholder={t('type_title_here')}
                required
                value={form.data.title}
                onChange={(e) => form.setData('title', e.target.value)}
              />

              <Error errorKey="title" />
            </div>

            <TabsContent className="w-full" value="text">
              <Label htmlFor="text">{t('text')}</Label>

              <Textarea
                className="mt-1"
                id="text"
                name="text"
                placeholder={t('text_placeholder')}
                value={form.data.text}
                onChange={(e) => form.setData('text', e.target.value)}
              />

              <Error errorKey="text" />
            </TabsContent>

            <TabsContent className="w-full" value="image">
              <Label htmlFor="image">{t('image')}</Label>

              <Input id="image" name="image" type="file" />

              <Error errorKey="image" />
            </TabsContent>

            <TabsContent className="w-full" value="link">
              <Label htmlFor="link">{t('link')}</Label>

              <Input
                id="link"
                name="link"
                type="url"
                placeholder={t('link_placeholder')}
                value={form.data.link}
                onChange={(e) => form.setData('link', e.target.value)}
              />

              <Error errorKey="link" />
            </TabsContent>

            <TabsContent className="w-full" value="meme"></TabsContent>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Button type="submit">{t('submit_post')}</Button>

            <Button variant="secondary" type="reset">
              {t('cancel')}
            </Button>
            {import.meta.env.VITE_USER_NODE_ENV === 'development' && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.setData({
                    title: 'Entrez le titre ici',
                    text: 'Computer Programming',
                    link: '',
                  })
                }}
              >
                Fill Development Values
              </Button>
            )}
          </div>
        </form>
      </main>
    </SocialLayout>
  )
}

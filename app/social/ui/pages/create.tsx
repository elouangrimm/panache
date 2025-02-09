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
import { Error } from '#common/ui/components/error'
import { useToast } from '#common/ui/hooks/use_toast'
import { CheckIcon } from 'lucide-react'

export default function Create() {
  const props = usePageProps<{ popularRooms: Room[]; joinedRooms?: Room[] }>()
  const rooms =
    props?.joinedRooms && props?.joinedRooms.length > 0 ? props.joinedRooms : props.popularRooms
  const { query } = usePageProps<{ query: Record<string, string> }>()
  const [roomSlug, setRoomSlug] = React.useState(
    query.room || rooms.length > 0 ? rooms[0].slug : ''
  )
  const form = useForm({
    title: '',
    text: '',
    link: '',
    image: null as File | null,
  })
  const t = useTranslate('social')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post(`/rooms/${roomSlug}/posts`, {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('post_created')}</span>
            </div>
          ),
        })
      },
    })
  }

  return (
    <SocialLayout>
      <h1 className="text-2xl font-semibold sm:pt-8">{t('create_a_post')}</h1>

      <form className="flex flex-col space-y-8 pt-6" onSubmit={handleSubmit}>
        <RoomSelect roomSlug={roomSlug} setRoomSlug={setRoomSlug} rooms={rooms} />

        <Tabs defaultValue="text" className="min-w-full">
          <TabsList className="flex flex-wrap sm:grid w-full h-full sm:grid-cols-3 gap-y-2 sm:gap-y-0 gap-x-4">
            <TabsTrigger value="text">{t('text')}</TabsTrigger>
            <TabsTrigger value="image">{t('image')}</TabsTrigger>
            <TabsTrigger value="link">{t('link')}</TabsTrigger>
            {/* <TabsTrigger value="meme">{t('meme')}</TabsTrigger> */}
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
              rows={5}
              placeholder={t('text_placeholder')}
              value={form.data.text}
              onChange={(e) => form.setData('text', e.target.value)}
              minLength={10}
              maxLength={10000}
            />

            <Error errorKey="text" />
          </TabsContent>

          <TabsContent className="w-full" value="image">
            <Label htmlFor="image">{t('image')}</Label>

            <Input
              id="image"
              name="image"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  form.setData('image', e.target.files[0])
                }
              }}
            />

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

        <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button type="submit">{t('submit_post')}</Button>

          <Button variant="secondary" type="reset">
            {t('cancel')}
          </Button>

          {/* @ts-ignore */}
          {import.meta.env.VITE_USER_NODE_ENV === 'development' && (
            <Button
              type="button"
              variant="warning"
              onClick={() => {
                form.setData({
                  title: 'Entrez le titre ici',
                  text: 'Computer Programming',
                  link: '',
                  image: null,
                })
              }}
            >
              Fill Development Values
            </Button>
          )}
        </div>
      </form>
    </SocialLayout>
  )
}

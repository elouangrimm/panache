import React from 'react'
import SocialLayout from '../components/social_layout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '#common/ui/components/tabs'
import useTranslate from '#common/ui/hooks/use_translate'
import { Label } from '#common/ui/components/label'
import { Input } from '#common/ui/components/input'
import { Button } from '#common/ui/components/button'
import { Textarea } from '#common/ui/components/textarea'

export default function Create() {
  const t = useTranslate('social')
  return (
    <SocialLayout>
      <form className="max-w-3xl flex flex-col w-full mx-auto">
        <h1 className="text-5xl font-serif sm:pt-16">{t('create_a_post')}</h1>
        <Tabs defaultValue="text" className="min-w-full pt-8">
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
            />
          </div>
          <TabsContent className="w-full" value="text">
            <Label htmlFor="text">{t('text')}</Label>
            <Textarea className="mt-1" id="text" name="text" placeholder={t('text_placeholder')} />
          </TabsContent>
          <TabsContent className="w-full" value="image">
            <Label htmlFor="image">{t('image')}</Label>
            <Input id="image" name="image" type="file" />
          </TabsContent>
          <TabsContent className="w-full" value="link">
            <Label htmlFor="link">{t('link')}</Label>
            <Input id="link" name="link" type="url" placeholder={t('link_placeholder')} />
          </TabsContent>
          <TabsContent className="w-full" value="meme"></TabsContent>
        </Tabs>
        <div className="flex items-center space-x-2 pt-6">
          <Button>{t('submit_post')}</Button>
          <Button variant="secondary">{t('save_draft')}</Button>
        </div>
      </form>
    </SocialLayout>
  )
}

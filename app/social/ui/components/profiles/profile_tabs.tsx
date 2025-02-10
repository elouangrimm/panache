import React from 'react'
import { TabLink, Tabs, TabsList } from '#common/ui/components/tabs'
import useTranslate from '#common/ui/hooks/use_translate'
import usePageProps from '#common/ui/hooks/use_page_props'
import User from '#common/models/user'

export type ProfileTabsProps = { resource: 'posts' | 'comments' }

export function ProfileTabs({ resource }: ProfileTabsProps) {
  const t = useTranslate('social')
  const { profile } = usePageProps<{ profile: User }>()

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="rooms" className="min-w-full">
        <TabsList className="flex flex-wrap sm:grid w-full h-full sm:grid-cols-2 gap-y-2 sm:gap-y-0 gap-x-4">
          <TabLink
            href={`/profiles/${profile.username}`}
            label={t('posts')}
            isActive={resource === 'posts'}
          />
          <TabLink
            href={`/profiles/${profile.username}/comments`}
            label={t('comments')}
            isActive={resource === 'comments'}
          />
        </TabsList>
      </Tabs>
    </div>
  )
}

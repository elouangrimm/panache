import React from 'react'
import { TabLink, Tabs, TabsList } from '#common/ui/components/tabs'
import useTranslate from '#common/ui/hooks/use_translate'
import { Link } from '@inertiajs/react'
import useQuery from '#common/ui/hooks/use_query'

export default function SearchTabs({ resource }: { resource: 'rooms' | 'posts' | 'comments' }) {
  const t = useTranslate('social')
  const query = useQuery()
  return (
    <Tabs defaultValue="rooms" className="min-w-full">
      <TabsList className="flex flex-wrap sm:grid w-full h-full sm:grid-cols-3 gap-y-2 sm:gap-y-0 gap-x-4">
        <TabLink
          href={`/rooms${query.search ? `?search=${query.search}` : ''}`}
          label={t('rooms')}
          isActive={resource === 'rooms'}
        />
        <TabLink
          href={`/posts${query.search ? `?search=${query.search}` : ''}`}
          label={t('posts')}
          isActive={resource === 'posts'}
        />
        <TabLink
          href={`/comments${query.search ? `?search=${query.search}` : ''}`}
          label={t('comments')}
          isActive={resource === 'comments'}
        />
      </TabsList>
    </Tabs>
  )
}

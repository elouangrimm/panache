import React from 'react'
import { Tabs, TabsList } from '#common/ui/components/tabs'
import useTranslate from '#common/ui/hooks/use_translate'
import { Link } from '@inertiajs/react'
import useQuery from '#common/ui/hooks/use_query'

export default function SearchTabs({ resource }: { resource: 'rooms' | 'posts' | 'comments' }) {
  const t = useTranslate('social')
  const query = useQuery()
  return (
    <Tabs defaultValue="rooms" className="min-w-full">
      <TabsList className="flex flex-wrap sm:grid w-full h-full sm:grid-cols-3 gap-y-2 sm:gap-y-0 gap-x-4">
        <Link
          className="inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          href={`/rooms${query.search ? `?search=${query.search}` : ''}`}
          data-state={resource === 'rooms' ? 'active' : 'inactive'}
        >
          {t('rooms')}
        </Link>
        <Link
          className="inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          href={`/posts${query.search ? `?search=${query.search}` : ''}`}
          data-state={resource === 'posts' ? 'active' : 'inactive'}
        >
          {t('posts')}
        </Link>
        <Link
          className="inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          href={`/comments${query.search ? `?search=${query.search}` : ''}`}
          data-state={resource === 'comments' ? 'active' : 'inactive'}
        >
          {t('comments')}
        </Link>
      </TabsList>
    </Tabs>
  )
}

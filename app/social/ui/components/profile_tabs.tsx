import React from 'react'
import { Tabs, TabsList } from '#common/ui/components/tabs'
import useTranslate from '#common/ui/hooks/use_translate'
import { Link } from '@inertiajs/react'
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
          <Link
            className="w-full inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            href={`/profiles/${profile.username}`}
            data-state={resource === 'posts' ? 'active' : 'inactive'}
          >
            {t('posts')}
          </Link>
          <Link
            className="w-full inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            href={`/profiles/${profile.username}/comments`}
            data-state={resource === 'comments' ? 'active' : 'inactive'}
          >
            {t('comments')}
          </Link>
        </TabsList>
      </Tabs>
    </div>
  )
}

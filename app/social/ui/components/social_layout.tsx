import { AppSidebar } from '#common/ui/components/app_sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#common/ui/components/sidebar'
import React from 'react'
import { NavRooms } from './nav_rooms'
import { Link } from '@inertiajs/react'
import { buttonVariants } from '#common/ui/components/button'
import useTranslate from '#common/ui/hooks/use_translate'
import { PlusCircleIcon } from 'lucide-react'
import { SearchInput } from './search_input'

export default function SocialLayout({ children }: React.PropsWithChildren) {
  const t = useTranslate('social')
  return (
    <SidebarProvider>
      <AppSidebar>
        <NavRooms />
      </AppSidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full justify-between items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <SearchInput />
            <div>
              <Link className={buttonVariants({ variant: 'secondary' })} href="/create">
                <PlusCircleIcon className="h-4 w-4" />
                <span>{t('create_a_post')}</span>
              </Link>
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

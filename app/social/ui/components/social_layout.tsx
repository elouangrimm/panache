import { AppSidebar } from '#common/ui/components/app_sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#common/ui/components/sidebar'
import React from 'react'
import { NavRooms } from './nav_rooms'
import { Head, Link } from '@inertiajs/react'
import { buttonVariants } from '#common/ui/components/button'
import useTranslate from '#common/ui/hooks/use_translate'
import { PlusCircleIcon } from 'lucide-react'
import { SearchInput } from './search_input'
import { Toaster } from '#common/ui/components/toaster'
import { SocialDropdown } from './social_dropdown'
import useUser from '#common/ui/hooks/use_user'
import { cn } from '#common/ui/lib/utils'

export type SocialLayoutProps = React.PropsWithChildren<{
  title?: string
}>

export default function SocialLayout({ children, title }: SocialLayoutProps) {
  const t = useTranslate('social')
  const user = useUser()
  return (
    <>
      <Head>{title ? <title>Panache Social - {title}</title> : <title>Panache Social</title>}</Head>
      <SidebarProvider>
        <AppSidebar>
          <NavRooms />
        </AppSidebar>
        <SidebarInset>
          <header className="flex pb-2 sm:pb-0 sm:h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex flex-wrap w-full justify-between items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <SearchInput />
              <div className="flex items-center gap-4">
                <Link
                  className={cn(
                    buttonVariants({ variant: 'secondary' }),
                    !user && '!cursor-not-allowed opacity-50'
                  )}
                  href={user ? '/create' : ''}
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  <span>{t('create_a_post')}</span>
                </Link>
                <SocialDropdown />
              </div>
            </div>
          </header>
          <Toaster />

          <main className="max-w-6xl mx-auto w-full p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

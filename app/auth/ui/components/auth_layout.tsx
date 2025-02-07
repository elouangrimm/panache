import Logo from '#common/ui/components/logo'
import { Link } from '@inertiajs/react'
import React from 'react'

export function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#f0eee6] p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex justify-center w-full">
          <Link className="hover:opacity-75 transition-opacity" href="/">
            <Logo className="h-10 w-10" />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#common/ui/components/dialog'
import { buttonVariants } from '#common/ui/components/button'
import Logo from '#common/ui/components/logo'
import { Link } from '@inertiajs/react'
import { cn } from '#common/ui/lib/utils'
import React from 'react'

export type AuthDialogProps = {
  open: boolean
  setOpen: (value: boolean) => void
}

export default function AuthDialog({ open, setOpen }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="mt-6 items-center">
          <Logo className="size-12 text-3xl" />
        </DialogHeader>

        <DialogTitle className="font-serif text-4xl text-center font-medium">
          Welcome back!
        </DialogTitle>
        <DialogDescription className="text-center">
          Log in to your account to start using Panache.
        </DialogDescription>

        <Link
          className={cn(buttonVariants({ variant: 'default' }), '!w-full')}
          href="/auth/sign_up"
        >
          Create an account
        </Link>
        <Link
          className={cn(buttonVariants({ variant: 'secondary' }), '!w-full')}
          href="/auth/sign_in"
        >
          Sign in
        </Link>
      </DialogContent>
    </Dialog>
  )
}

import React from 'react'
import { cn } from '#common/ui/lib/utils'
import { Button } from '#common/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import { Input } from '#common/ui/components/input'
import { Label } from '#common/ui/components/label'
import { Link } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'

export function SignInForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslate('auth')

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-normal font-serif">{t('sign_in_title')}</CardTitle>
          <CardDescription>{t('sign_in_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="username">{t('username_label')}</Label>
                <div className="relative">
                  <Input
                    autoComplete="panache-username"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="cyrano.bergerac"
                    required
                    className="pr-20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    @panache.so
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('password_label')}</Label>
                  <Link
                    href="/auth/forgot_password"
                    className="ml-auto text-sm text-emerald-700 hover:text-emerald-600 transition-colors underline underline-offset-4"
                  >
                    {t('forgot_password')}
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••••" required />
              </div>
              <Button type="submit" className="!w-full">
                {t('sign_in')}
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4">
              {t('no_account_prompt')}{' '}
              <Link
                href="/auth/sign_up"
                className="underline underline-offset-4 text-emerald-700 hover:text-emerald-600 transition-colors"
              >
                {t('sign_up')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

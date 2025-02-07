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
import { Link, useForm } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'
import { Error } from '#common/ui/components/error'

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslate('auth')
  const form = useForm({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post('/auth/sign_up')
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-normal font-serif">{t('sign_up_title')}</CardTitle>
          <CardDescription>{t('sign_up_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <div className="grid sm:grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">{t('first_name_label')}</Label>
                  <Input
                    autoComplete="panache-firstname"
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Cyrano"
                    required
                    value={form.data.firstName}
                    onChange={(e) => form.setData('firstName', e.target.value)}
                  />
                  <Error errorKey="firstName" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">{t('last_name_label')}</Label>
                  <Input
                    autoComplete="panache-lastName"
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="de Bergerac"
                    required
                    value={form.data.lastName}
                    onChange={(e) => form.setData('lastName', e.target.value)}
                  />
                  <Error errorKey="lastName" />
                </div>
              </div>
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
                    value={form.data.username}
                    onChange={(e) => form.setData('username', e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    @panache.so
                  </span>
                </div>
                <Error errorKey="username" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('email_label')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('email_placeholder')}
                  value={form.data.email}
                  onChange={(e) => form.setData('email', e.target.value)}
                />
                <Error errorKey="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('password_label')}</Label>
                <Input
                  autoComplete="panache-password"
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  required
                  value={form.data.password}
                  onChange={(e) => form.setData('password', e.target.value)}
                />
                <Error errorKey="password" />
              </div>
              <Button type="submit" className="!w-full">
                {t('sign_up')}
              </Button>
              {import.meta.env.VITE_USER_NODE_ENV === 'development' && (
                <Button
                  type="button"
                  variant="warning"
                  className="!w-full"
                  onClick={() => {
                    form.setData({
                      firstName: 'Cyrano',
                      lastName: 'de Bergerac',
                      username: 'cyrano.bergerac',
                      email: 'cyrano.bergerac@exemple.fr',
                      password: 'cyrano.bergerac@exemple.fr',
                    })
                  }}
                >
                  Fill Development Values
                </Button>
              )}
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4">
              {t('existing_account_prompt')}{' '}
              <Link
                href="/auth/sign_in"
                className="underline underline-offset-4 text-emerald-700 hover:text-emerald-600 transition-colors"
              >
                {t('sign_in')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

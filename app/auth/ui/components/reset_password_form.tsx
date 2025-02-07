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
import useTranslate from '#common/ui/hooks/use_translate'

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslate('auth')

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-normal font-serif">
            {t('forgot_password_title')}
          </CardTitle>
          <CardDescription>{t('forgot_password_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('email_label')}</Label>
                <Input
                  autoComplete="panache-email"
                  id="email"
                  name="email"
                  type="text"
                  placeholder={t('email_placeholder')}
                  required
                  className="pr-20"
                />
              </div>
              <Button type="submit" className="!w-full">
                {t('send_reset_link')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

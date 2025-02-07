import React from 'react'
import { AuthLayout } from '#auth/ui/components/auth_layout'
import { Head } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'
import { ResetPasswordForm } from '../components/reset_password_form'

export default function ResetPasswordPage() {
  const t = useTranslate('auth')

  return (
    <>
      <Head title={t('reset_password_title')} />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  )
}

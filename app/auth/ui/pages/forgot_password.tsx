import React from 'react'
import { AuthLayout } from '#auth/ui/components/auth_layout'
import { Head } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'
import { ForgotPasswordForm } from '../components/forgot_password_form'

export default function SignUpPage() {
  const t = useTranslate('auth')

  return (
    <>
      <Head title={t('forgot_password_title')} />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  )
}

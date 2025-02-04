import React from 'react'
import { AuthLayout } from '#auth/ui/components/auth_layout'
import { SignInForm } from '#auth/ui/components/sign_in_form'
import { Head } from '@inertiajs/react'
import useTranslate from '#common/ui/hooks/use_translate'

export default function SignInPage() {
  const t = useTranslate('auth')

  return (
    <>
      <Head title={t('sign_in')} />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  )
}

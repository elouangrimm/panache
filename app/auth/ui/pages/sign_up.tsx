import { AuthLayout } from '#auth/ui/components/auth_layout'
import { SignUpForm } from '#auth/ui/components/sign_up_form'
import { Head } from '@inertiajs/react'

export default function SignUpPage() {
  return (
    <>
      <Head title="Sign Up" />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  )
}

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

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-normal font-serif">Create an account</CardTitle>
          <CardDescription>Sign up to start using Panache.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  autoComplete="panache-fullname"
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Cyrano de Bergerac"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="localPart">Username</Label>
                <div className="relative">
                  <Input
                    autoComplete="panache-username"
                    id="localPart"
                    name="localPart"
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
                <Label htmlFor="backupEmail">Email Address</Label>
                <Input
                  id="backupEmail"
                  name="backupEmail"
                  type="email"
                  placeholder="cyrano.bergerac@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  autoComplete="panache-password"
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  required
                />
              </div>
              <Button type="submit" className="!w-full">
                Sign Up
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-4">
              Already have an account?{' '}
              <Link
                href="/auth/sign_in"
                className="underline underline-offset-4 text-emerald-700 hover:text-emerald-600 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-[13px] text-muted-foreground">
        By proceeding, you agree to our
        <br />{' '}
        <Link
          className="text-emerald-700 hover:text-emerald-600 underline transition-colors"
          href="#"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          className="text-emerald-700 hover:text-emerald-600 underline transition-colors"
          href="#"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  )
}

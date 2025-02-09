import { Button } from '#common/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#common/ui/components/dialog'
import { Error } from '#common/ui/components/error'
import { Input } from '#common/ui/components/input'
import { Label } from '#common/ui/components/label'
import useParams from '#common/ui/hooks/use_params'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'
import { useForm } from '@inertiajs/react'
import { CheckIcon, PenIcon } from 'lucide-react'
import React from 'react'

export function EditUsernameDialog() {
  const user = useUser()
  const t = useTranslate()
  const form = useForm({
    username: user?.currentProfile?.username || '',
  })
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const params = useParams()

  if (!user || user.currentProfile.username !== params.username) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.patch(`/profiles/${user.currentProfile.username}/username`, {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('social.username_updated')}</span>
            </div>
          ),
        })
        setOpen(false)
      },
    })
  }

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <svg
          className="text-emerald-900 hover:text-emerald-700 transition-colors cursor-pointer !h-5 !w-5"
          width={24}
          height={24}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.533 11.15A1.82 1.82 0 0 0 9 12.438V15h2.578c.483 0 .947-.192 1.289-.534l7.6-7.604a1.82 1.82 0 0 0 0-2.577l-.751-.751a1.82 1.82 0 0 0-2.578 0z" />
          <path d="M21 12c0 4.243 0 6.364-1.318 7.682S16.242 21 12 21s-6.364 0-7.682-1.318S3 16.242 3 12s0-6.364 1.318-7.682S7.758 3 12 3" />
        </svg>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('social.update_username')}</DialogTitle>
          </DialogHeader>
          <form className="mt-4" id="edit-username-form" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="username">{t('auth.username_label')}</Label>
              <Input
                autoComplete="panache-username"
                id="username"
                name="username"
                type="text"
                placeholder="cyrano.bergerac"
                required
                value={form.data.username}
                onChange={(e) =>
                  form.setData('username', e.target.value.toLowerCase().replaceAll(' ', '.'))
                }
              />
              <Error errorKey="username" />
            </div>
          </form>
          <DialogFooter className="mt-4">
            <Button className="!w-full" type="submit" form="edit-username-form">
              {t('social.update_username')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

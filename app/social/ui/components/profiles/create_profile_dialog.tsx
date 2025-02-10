import { Button } from '#common/ui/components/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#common/ui/components/dialog'
import { Input } from '#common/ui/components/input'
import { Label } from '#common/ui/components/label'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import { useForm } from '@inertiajs/react'
import { CheckIcon } from 'lucide-react'
import React, { FormEvent } from 'react'
import { Error } from '#common/ui/components/error'

export const CreateProfileDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) => {
  const form = useForm({
    username: '',
  })
  const t = useTranslate()
  const { toast } = useToast()
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    form.post('/profiles', {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('social.profile_created')}</span>
            </div>
          ),
        })
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('social.create_new_profile')}</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col space-y-6 pt-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="username">{t('auth.username_label')}</Label>
            <Input
              autoComplete="panache-username"
              id="username"
              name="username"
              type="text"
              placeholder="cyrano.bergerac"
              required
              className="pr-20"
              value={form.data.username}
              onChange={(e) =>
                form.setData('username', e.target.value.toLowerCase().replaceAll(' ', '.'))
              }
            />
            <Error errorKey="username" />
          </div>
          <Button className="!w-full" type="submit">
            {t('social.create_new_profile')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

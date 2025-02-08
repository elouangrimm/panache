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
import { SidebarMenuButton } from '#common/ui/components/sidebar'
import { Textarea } from '#common/ui/components/textarea'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'
import { useForm } from '@inertiajs/react'
import { CheckIcon, PlusCircleIcon } from 'lucide-react'
import React from 'react'

export function CreateRoomDialog() {
  const t = useTranslate('social')
  const form = useForm({
    name: '',
    description: '',
  })
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const user = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post('/rooms', {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('room_created')}</span>
            </div>
          ),
        })
        setOpen(false)
      },
    })
  }

  return (
    <>
      <SidebarMenuButton
        disabled={!user}
        className="text-sidebar-foreground/80 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <PlusCircleIcon className="text-sidebar-foreground/80 !h-5 !w-5 ml-0.5" />
        <span>{t('create_a_room')}</span>
      </SidebarMenuButton>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('create_a_room')}</DialogTitle>
            <DialogDescription>{t('create_a_room_description')}</DialogDescription>
          </DialogHeader>
          <form id="create-room-form" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">{t('room_name')}</Label>
              <Input
                autoComplete="off"
                id="name"
                name="name"
                type="text"
                placeholder={t('room_name_placeholder')}
                required
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
              />
              <Error errorKey="name" />
            </div>
            <div className="grid gap-2 mt-4">
              <Label htmlFor="description">{t('room_description')}</Label>
              <Textarea
                autoComplete="off"
                id="description"
                name="description"
                placeholder={t('room_description_placeholder')}
                required
                value={form.data.description}
                onChange={(e) => form.setData('description', e.target.value)}
              ></Textarea>
              <Error errorKey="description" />
            </div>
          </form>
          <DialogFooter>
            <Button className="!w-full" type="submit" form="create-room-form">
              {t('create_a_room')}
            </Button>

            {/* @ts-ignore */}
            {import.meta.env.VITE_USER_NODE_ENV === 'development' && (
              <Button
                type="button"
                variant="warning"
                className="!w-full"
                onClick={() => {
                  form.setData({
                    name: 'Programming',
                    description: 'Computer Programming',
                  })
                }}
              >
                Fill Development Values
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

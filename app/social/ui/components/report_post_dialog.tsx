import { Button } from '#common/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#common/ui/components/dialog'
import Error from '#common/ui/components/error'
import { Input } from '#common/ui/components/input'
import { Label } from '#common/ui/components/label'
import { SidebarMenuButton } from '#common/ui/components/sidebar'
import { Textarea } from '#common/ui/components/textarea'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import { useForm } from '@inertiajs/react'
import { CheckIcon, PlusCircleIcon } from 'lucide-react'
import React from 'react'

export function ReportPostDialog({
  post,
  open,
  setOpen,
}: {
  post: Post
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const t = useTranslate('social')
  const form = useForm({
    description: '',
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`/rooms/${post.roomId}/posts/${post.id}/report`, {
      method: 'POST',
      credentials: 'include',
    })
    toast({
      description: (
        <div className="flex items-center space-x-2">
          <CheckIcon className="text-emerald-700 h-4 w-4" />
          <span>{t('post_reported')}</span>
        </div>
      ),
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('report_post_title')}</DialogTitle>
          <DialogDescription>{t('report_post_description')}</DialogDescription>
        </DialogHeader>
        <form id="create-room-form" onSubmit={handleSubmit}>
          <div className="grid gap-2 mt-4">
            <Label htmlFor="description">{t('report_description')}</Label>
            <Textarea
              autoComplete="off"
              id="description"
              name="description"
              placeholder={t('report_description_placeholder')}
              required
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
            ></Textarea>
            <Error errorKey="description" />
          </div>
        </form>
        <DialogFooter>
          <Button className="!w-full" type="submit" form="create-room-form">
            {t('report')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

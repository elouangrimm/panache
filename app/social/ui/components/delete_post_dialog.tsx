import { Button } from '#common/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#common/ui/components/dialog'
import useTranslate from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import { useForm } from '@inertiajs/react'
import React from 'react'

export function DeletePostDialog({
  post,
  open,
  setOpen,
}: {
  post: Post
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const t = useTranslate('social')
  const form = useForm({})

  const handleDelete = () => {
    form.delete(`/rooms/${post.roomId}/posts/${post.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('delete_post')}</DialogTitle>
          <DialogDescription>{t('delete_post_description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="danger" onClick={handleDelete}>
            {t('delete_post')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
import Comment from '#social/models/comment'
import { useForm } from '@inertiajs/react'
import React from 'react'
import { useToast } from '#common/ui/hooks/use_toast'
import { CheckIcon } from 'lucide-react'

export function DeleteCommentDialog({
  comment,
  open,
  setOpen,
}: {
  comment: Comment
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const t = useTranslate('social')
  const form = useForm({})
  const { toast } = useToast()

  const handleDelete = () => {
    form.delete(`/comments/${comment.id}`, {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('comment_deleted')}</span>
            </div>
          ),
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('delete_comment')}</DialogTitle>
          <DialogDescription>{t('delete_comment_description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="danger" onClick={handleDelete}>
            {t('delete_comment')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

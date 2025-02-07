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
import { Label } from '#common/ui/components/label'
import { Textarea } from '#common/ui/components/textarea'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import Comment from '#social/models/comment'
import { useForm } from '@inertiajs/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'

export function ReportCommentDialog({
  comment,
  open,
  setOpen,
}: {
  comment: Comment
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const t = useTranslate()
  const form = useForm({
    description: '',
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch(`/comments/${comment.id}/report`, {
      method: 'POST',
      credentials: 'include',
    })

    toast({
      description: (
        <div className="flex items-center space-x-2">
          <CheckIcon className="text-emerald-700 h-4 w-4" />
          <span>{t('social.comment_reported')}</span>
        </div>
      ),
    })

    form.setData('description', '')

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('social.report_comment_title')}</DialogTitle>
          <DialogDescription>{t('social.report_subtitle')}</DialogDescription>
        </DialogHeader>

        <form id="create-comment-form" onSubmit={handleSubmit}>
          <div className="grid gap-2 mt-4">
            <Label htmlFor="description">{t('common.description')}</Label>
            <Textarea
              autoComplete="off"
              id="description"
              name="description"
              placeholder={t('social.report_description_placeholder')}
              required
              value={form.data.description}
              onChange={(e) => form.setData('description', e.target.value)}
            ></Textarea>
            <Error errorKey="description" />
          </div>
        </form>

        <DialogFooter>
          <Button className="!w-full" variant="warning" type="submit" form="create-comment-form">
            {t('social.report')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

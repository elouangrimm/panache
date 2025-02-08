import { Button } from '#common/ui/components/button'
import { Textarea } from '#common/ui/components/textarea'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'
import Post from '#social/models/post'
import Comment from '#social/models/comment'
import { useForm } from '@inertiajs/react'
import { CheckIcon } from 'lucide-react'
import React, { FormEvent } from 'react'
import useUser from '#common/ui/hooks/use_user'

export default function CreateCommentForm({
  post,
  comment,
  onCancel,
}: {
  post: Post
  comment?: Comment
  onCancel?: () => void
}) {
  const t = useTranslate()
  const form = useForm({
    text: '',
    commentId: comment?.id,
  })
  const { toast } = useToast()
  const user = useUser()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    form.post(`/posts/${post.id}/comments`, {
      onSuccess: () => {
        toast({
          description: (
            <div className="flex items-center space-x-2">
              <CheckIcon className="text-emerald-700 h-4 w-4" />
              <span>{t('social.comment_submitted')}</span>
            </div>
          ),
        })
        form.setData('text', '')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} id="comments">
      <Textarea
        name="comment"
        id="comment"
        placeholder={t('social.add_comment')}
        value={form.data.text}
        onChange={(e) => form.setData('text', e.target.value)}
      ></Textarea>

      {form.data.text ? (
        <div className="flex items-center gap-x-2 pt-4 w-full">
          <Button type="submit" disabled={!user}>
            {t('common.submit')}
          </Button>
          <Button
            variant="secondary"
            type="reset"
            onClick={() => {
              if (onCancel) {
                onCancel()
              } else {
                form.setData('text', '')
              }
            }}
          >
            {t('common.cancel')}
          </Button>

          {/* @ts-ignore */}
          {import.meta.env.VITE_USER_NODE_ENV === 'development' && (
            <Button
              type="button"
              variant="warning"
              onClick={() => {
                form.setData({
                  text: 'This is my comment',
                  commentId: comment?.id,
                })
              }}
            >
              Fill Development Values
            </Button>
          )}
        </div>
      ) : null}
    </form>
  )
}

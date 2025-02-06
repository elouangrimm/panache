import { Card } from '#common/ui/components/card'
import PostComment from '#social/models/post_comment'
import React from 'react'
import { CommentActions } from './comment_actions'
import { Avatar, AvatarFallback, AvatarImage } from '#common/ui/components/avatar'
import Post from '#social/models/post'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import useTranslate, { useLocale } from '#common/ui/hooks/use_translate'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#common/ui/components/accordion'

export type CommentCardProps = {
  post: Post
  comment: PostComment
}

export function CommentCard({ post, comment }: CommentCardProps) {
  const t = useTranslate()
  const locale = useLocale()
  const timeAgo = formatDistanceToNow(new Date(post.createdAt as unknown as string), {
    addSuffix: true,
    locale: locale === 'fr' ? fr : undefined,
  })

  return (
    <Card className="p-4" id={`comment-${comment.id}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={`https://avatar.vercel.sh/${post.user.username}`}
              alt={post.user.username}
            />
            <AvatarFallback>{post.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1 text-[13px]">
            <span className="font-medium">{post.user.username}</span>
            <span className="text-muted-foreground">• {timeAgo}</span>
          </div>
        </div>
      </div>

      <p className="text-sm truncate pt-2">{comment.text}</p>

      <div className="pt-2">
        <CommentActions post={post} comment={comment} />
      </div>

      {comment.comments?.length > 0 ? (
        <Accordion className="mt-2" type="multiple">
          <AccordionItem className="border-b-0" value={`comments-${comment.id}-replies`}>
            <AccordionTrigger className="cursor-pointer !w-auto !pb-2 justify-normal gap-x-2">
              {t('social.view_replies')}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {comment.comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} post={post} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </Card>
  )
}

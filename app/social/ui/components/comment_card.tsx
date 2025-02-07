import { Card } from '#common/ui/components/card'
import Comment from '#social/models/comment'
import React from 'react'
import { CommentActions } from './comment_actions'
import Post from '#social/models/post'
import useTranslate from '#common/ui/hooks/use_translate'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#common/ui/components/accordion'
import { CommentActionsDropdown } from './comment_actions_dropdown'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import { Link } from '@inertiajs/react'

export type CommentCardProps = {
  header?: React.ReactElement
  post: Post
  comment: Comment
  hideReply?: boolean
}

export function CommentCard({ header, post, comment, hideReply }: CommentCardProps) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <Card className="p-4" id={`comment-${comment.id}`}>
      <div className="flex items-center justify-between">
        {header}

        <CommentActionsDropdown comment={comment} />
      </div>

      <p className="text-sm truncate pt-2">{comment.text}</p>

      <div className="pt-2">
        <CommentActions post={post} comment={comment} hideReply={hideReply} />
      </div>

      {comment.comments?.length > 0 ? (
        <Accordion className="mt-2" type="multiple">
          <AccordionItem className="border-b-0" value={`comments-${comment.id}-replies`}>
            <AccordionTrigger className="cursor-pointer !w-auto !pb-2 justify-normal gap-x-2">
              {t('social.view_replies')}
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {comment.comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  post={post}
                  header={
                    <div className="flex items-center gap-2">
                      <Link
                        className="hover:opacity-75 transition-opacity"
                        href={`/profiles/${comment.user.username}`}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${comment.user.username}`}
                            alt={comment.user.username}
                          />
                        </Avatar>
                      </Link>

                      <div className="flex items-center gap-1 text-[13px]">
                        <Link
                          className="hover:text-emerald-900 transition-colors font-medium"
                          href={`/profiles/${comment.user.username}`}
                        >
                          {comment.user.username}
                        </Link>
                        <span className="text-muted-foreground">
                          • {formatDistanceToNow(comment.createdAt as unknown as string)}
                        </span>
                      </div>
                    </div>
                  }
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </Card>
  )
}

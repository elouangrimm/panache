import React from 'react'
import SocialLayout from '../components/social_layout'
import SearchTabs from '../components/search_tabs'
import Comment from '#social/models/comment'
import { Link } from '@inertiajs/react'
import { Avatar, AvatarImage } from '#common/ui/components/avatar'
import useTranslate from '#common/ui/hooks/use_translate'
import { CommentCard } from '../components/comment_card'
import { useFormatDistanceToNow } from '#common/ui/hooks/use_format_distance_to_now'
import { Alert, AlertTitle, AlertDescription } from '#common/ui/components/alert'
import { SearchX } from 'lucide-react'

export default function Comments({ comments }: { comments: Comment[] }) {
  const t = useTranslate()
  const formatDistanceToNow = useFormatDistanceToNow()

  return (
    <SocialLayout>
      <SearchTabs resource="comments" />

      <div className="grid gap-y-4 pt-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            post={comment.post}
            comment={comment}
            hideReply
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    className="hover:opacity-75 transition-opacity"
                    href={`/rooms/${comment.post.room.id}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${comment.post.room.id}?`}
                        alt={comment.post.room.id}
                        width={32}
                        height={32}
                      />
                    </Avatar>
                  </Link>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-[13px]">
                      <Link
                        className="font-medium hover:text-emerald-600 transition-colors"
                        href={`/rooms/${comment.post.room.id}`}
                      >
                        {comment.post.room.name}
                      </Link>
                      <span>•</span>
                      <Link
                        className="font-medium text-muted-foreground hover:text-emerald-600 transition-colors truncate"
                        href={`/rooms/${comment.post.room.id}/posts/${comment.post.id}`}
                      >
                        {comment.post.title}
                      </Link>
                    </div>

                    <p className="text-muted-foreground text-xs">
                      <span className="text-black font-medium">{comment.profile.username}</span>{' '}
                      {t('social.commented')}{' '}
                      {formatDistanceToNow(comment.createdAt as unknown as string)}
                    </p>
                  </div>
                </div>
              </div>
            }
          />
        ))}
        {comments.length === 0 ? (
          <Alert>
            <SearchX className="h-5 w-5 stroke-red-700" />
            <AlertTitle>{t('social.no_results_title')}</AlertTitle>
            <AlertDescription>{t('social.no_results_description')}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </SocialLayout>
  )
}

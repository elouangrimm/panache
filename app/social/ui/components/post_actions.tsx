import { Share2, MessageSquare, ClipboardCopyIcon, CheckIcon, Heart } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
import Post from '#social/models/post'
import { Button, buttonVariants } from '#common/ui/components/button'
import { cn } from '#common/ui/lib/utils'
import { Link } from '@inertiajs/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#common/ui/components/dropdown-menu'
import { useToast } from '#common/ui/hooks/use_toast'
import useTranslate from '#common/ui/hooks/use_translate'

interface PostCardProps {
  post: Post
}

export function PostActions({ post }: PostCardProps) {
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [userLikes, setUserLikes] = useState(post.likes?.length > 0 || false)
  const t = useTranslate('social')
  const { toast } = useToast()

  const handleCopyLink = (e: FormEvent) => {
    navigator.clipboard.writeText(`https://panache.so/rooms/${post.roomId}/posts/${post.id}`)
    toast({
      description: (
        <div className="flex items-center space-x-2">
          <CheckIcon className="text-emerald-700 h-4 w-4" />
          <span>{t('link_copied')}</span>
        </div>
      ),
    })
    e.stopPropagation()
  }

  const handleClickLike = async (e: FormEvent) => {
    e.preventDefault()

    if (userLikes) {
      /**
       * Handle dislike.
       */
      await fetch(`/rooms/${post.roomId}/posts/${post.id}/unlike`, {
        method: 'POST',
        credentials: 'include',
      })
      setLikesCount((likesCount) => likesCount - 1)
      setUserLikes(false)
    } else {
      /**
       * Handle like.
       */
      await fetch(`/rooms/${post.roomId}/posts/${post.id}/like`, {
        method: 'POST',
        credentials: 'include',
      })
      setLikesCount((likesCount) => likesCount + 1)
      setUserLikes(true)
      e.stopPropagation()
    }
  }

  return (
    <div className="flex items-center pt-1 gap-1 text-xs">
      <Button
        variant="outline"
        className={cn('!h-8', userLikes && 'text-red-800')}
        onClick={handleClickLike}
      >
        <Heart className="h-4 w-4" strokeWidth={2.5} />
        <span className="font-semibold text-xs">{likesCount}</span>
      </Button>

      <Link
        className={cn('!h-8', buttonVariants({ variant: 'outline' }))}
        href={`/rooms/${post.roomId}/posts/${post.id}#comments`}
      >
        <MessageSquare className="h-4 w-4" />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="!text-sm !h-8">
            <Share2 className="h-4 w-4" />
            <span>{t('share')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleCopyLink}>
            <ClipboardCopyIcon className="h-4 w-4" />
            <span>{t('copy_link')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

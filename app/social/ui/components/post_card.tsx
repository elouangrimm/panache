import { MoreHorizontal, Share2, MessageSquare, ArrowBigUp, ArrowBigDown } from 'lucide-react'
import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Post from '#social/models/post'
import { Card } from '#common/ui/components/card'
import { Button } from '#common/ui/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '#common/ui/components/avatar'

interface PostCardProps {
  post: Post
  onVote?: (value: number) => void
  onComment?: () => void
  onShare?: () => void
}

export function PostCard({ post, onVote, onComment, onShare }: PostCardProps) {
  const [votes, setVotes] = useState(55)
  const [userVote, setUserVote] = useState<1 | -1 | 0>(0)

  const handleVote = (value: 1 | -1) => {
    const newValue = userVote === value ? 0 : value
    const voteDiff = newValue - userVote
    setUserVote(newValue)
    setVotes((prev) => prev + voteDiff)
    onVote?.(newValue)
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt as unknown as string), {
    addSuffix: true,
  })

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://avatar.vercel.sh/${post.room.slug}`}
                alt={post.room.name}
              />
              <AvatarFallback>{post.room.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="font-medium">{post.room.name}</span>
              {/* {post.subreddit === 'france' && (
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-02-04%20a%CC%80%2018.46.56-mMn5AlIPi1G46std6woXDbWYTrDI3U.png"
                  alt="French flag"
                  width={20}
                  height={14}
                  className="inline-block"
                />
              )} */}
              <span className="text-sm text-muted-foreground">• {timeAgo}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xl font-medium mb-2">{post.title}</h2>
          {/* {post.link && (
            <a
              href={post.link}
              className="text-blue-600 hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.link.length > 60 ? `${post.link.slice(0, 60)}...` : post.link}
            </a>
          )} */}
        </div>

        {/* Image */}
        {post.image && (
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <img src={post.image || '/placeholder.svg'} alt={post.title} className="object-cover" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center bg-muted rounded-full">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-l-full h-8 w-8 ${userVote === 1 ? 'text-orange-500' : ''}`}
              onClick={() => handleVote(1)}
            >
              <ArrowBigUp className="h-5 w-5" />
            </Button>
            <span className="px-2 font-medium">{votes}</span>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-r-full h-8 w-8 ${userVote === -1 ? 'text-blue-500' : ''}`}
              onClick={() => handleVote(-1)}
            >
              <ArrowBigDown className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="flex items-center gap-2 h-8 rounded-full"
            onClick={onComment}
          >
            <MessageSquare className="h-4 w-4" />
            {/* <span>{post.comments}</span> */}
          </Button>

          <Button
            variant="ghost"
            className="flex items-center gap-2 h-8 rounded-full"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

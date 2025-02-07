import React from 'react'
import Post from '#social/models/post'
import { Card } from '#common/ui/components/card'
import Room from '#social/models/room'
import { Link } from '@inertiajs/react'
import { PostActions } from './post_actions'
import { ImagePreview } from '#common/ui/components/image_preview'

interface PostCardProps {
  header?: React.ReactElement
  room: Room
  post: Post
}

export function PostCard({ header, post }: PostCardProps) {
  return (
    <Link href={`/rooms/${post.roomId}/posts/${post.id}`}>
      <Card className="hover:bg-accent transition-colors">
        <div className="p-4">
          {header}

          {/* Content */}
          <div className="pt-2">
            <h2 className="font-medium">{post.title}</h2>
            {post.link && (
              <a
                href={post.link}
                className="text-blue-600 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {post.link.length > 60 ? `${post.link.slice(0, 60)}...` : post.link}
              </a>
            )}
          </div>

          {post.text && <p className="text-sm truncate">{post.text}</p>}

          {/* Image */}
          {post.image && <ImagePreview image={{ src: post.image, alt: post.title + 's Image' }} />}

          <div className="pt-2">
            <PostActions post={post} />
          </div>
        </div>
      </Card>
    </Link>
  )
}

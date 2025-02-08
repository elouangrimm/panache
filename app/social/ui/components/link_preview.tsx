import { Card } from '#common/ui/components/card'
import { cn } from '#common/ui/lib/utils'
import React from 'react'

interface LinkPreviewProps {
  image: {
    src: string
    alt: string
  }
  link?: string
  title?: string
  domain?: string
  className?: string
  /** Custom maxHeight overrides the default height */
  maxHeight?: number
  maintainAspectRatio?: boolean
  /** When true, uses a smaller version (300px) by default */
  small?: boolean
  setHovered?: (hovered: boolean) => void
}

export function LinkPreview({
  image,
  title,
  domain,
  className,
  maxHeight,
  maintainAspectRatio = false,
  link,
  small = false,
  setHovered,
}: LinkPreviewProps) {
  // If a maxHeight isn’t provided, use 300px for the small version,
  // otherwise fall back to the original 400px.
  const appliedMaxHeight = maxHeight ?? (small ? 300 : 400)

  return (
    <a
      className="hover:opacity-75 transition-opacity"
      onClick={(e) => e.stopPropagation()}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered?.(true)}
      onMouseLeave={() => setHovered?.(false)}
    >
      <Card className={cn('overflow-hidden group cursor-pointer w-full', className)}>
        <div
          className={cn(
            'relative w-full overflow-hidden bg-muted',
            // If maintaining aspect ratio, use the Tailwind aspect class,
            // otherwise remove the fixed min-height class in favor of inline styles.
            maintainAspectRatio ? 'aspect-[1.91/1]' : ''
          )}
          style={{
            maxHeight: appliedMaxHeight,
            // Use a min-height equal to half of the max height when not maintaining aspect ratio.
            ...(maintainAspectRatio ? {} : { minHeight: appliedMaxHeight / 2 }),
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
          <img
            src={image.src || '/placeholder.svg'}
            alt={image.alt}
            className="object-contain"
            loading="lazy"
          />
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <h3 className="text-sm font-medium text-white line-clamp-2">{title}</h3>
              {domain && <p className="text-xs text-white/80 mt-1">{domain}</p>}
            </div>
          )}
        </div>
      </Card>
    </a>
  )
}

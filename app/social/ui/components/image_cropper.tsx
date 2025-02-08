'use client'

import React, { type SyntheticEvent } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop'
import { Button } from '#common/ui/components/button'
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogFooter,
} from '#common/ui/components/dialog'
import 'react-image-crop/dist/ReactCrop.css'
import useTranslate from '#common/ui/hooks/use_translate'

interface ImageCropperProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedFile: string
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>
  callback: (croppedImageUrl: string) => void
  title?: string
}

export function ImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
  callback,
  title,
}: ImageCropperProps) {
  const aspect = 1
  const AVATAR_SIZE = 96 // Fixed size for avatar
  const t = useTranslate()
  const imgRef = React.useRef<HTMLImageElement | null>(null)

  const [crop, setCrop] = React.useState<Crop>()
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>('')

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop)
      setCroppedImageUrl(croppedImageUrl)
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    // Create temporary canvas for initial crop
    const tempCanvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    tempCanvas.width = crop.width * scaleX
    tempCanvas.height = crop.height * scaleY

    const ctx = tempCanvas.getContext('2d')

    if (ctx) {
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )

      // Create final canvas for 96x96 output
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = AVATAR_SIZE
      finalCanvas.height = AVATAR_SIZE

      const finalCtx = finalCanvas.getContext('2d')
      if (finalCtx) {
        finalCtx.imageSmoothingEnabled = true
        finalCtx.imageSmoothingQuality = 'high'
        finalCtx.drawImage(
          tempCanvas,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
          0,
          0,
          AVATAR_SIZE,
          AVATAR_SIZE
        )
      }

      return finalCanvas.toDataURL('image/png', 1.0)
    }

    return ''
  }

  async function onCrop() {
    try {
      callback(croppedImageUrl)
      setDialogOpen(false)
    } catch (error) {
      alert('Something went wrong!' + error)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="p-0 gap-0 lg:!max-w-xl xl:!max-w-2xl">
        <DialogTitle className="p-6">{title || 'Crop Avatar Image'}</DialogTitle>

        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            className="w-full"
            aspect={aspect}
            circularCrop
          >
            {selectedFile && (
              <img
                ref={imgRef}
                className="size-full rounded-none"
                alt="Image Cropper Shell"
                src={selectedFile}
                onLoad={onImageLoad}
              />
            )}
          </ReactCrop>
        </div>
        <DialogFooter className="p-6 pt-0 justify-center">
          <DialogClose asChild>
            <Button
              size={'sm'}
              type="reset"
              className="w-fit"
              variant="secondary"
              onClick={() => {
                setSelectedFile('')
              }}
            >
              {t('common.cancel')}
            </Button>
          </DialogClose>
          <Button type="submit" size={'sm'} className="w-fit" onClick={onCrop}>
            {t('common.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to center the crop
export function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
        height: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

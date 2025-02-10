'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, FabricImage, PencilBrush } from 'fabric'
import * as fabric from 'fabric'
import { useWindow } from '../hooks/use_window'

const CANVAS_DIMENSIONS = { width: 500, maxHeight: 800, height: 500 }
const DEFAULT_BACKGROUND_COLOR = '#8d927b'
const DEFAULT_FONT_COLOR = '#000000'
const DEFAULT_FONT_FAMILY = 'Impact'
const DEFAULT_TEXT_OPTIONS = {
  text: 'Your Text Here',
  fontSize: 40,
  fontFamily: DEFAULT_FONT_FAMILY,
  fill: DEFAULT_FONT_COLOR,
  textAlign: 'center',
}

export interface SelectedTextPropertiesProps {
  fontFamily: string
  fontColor: string
  isTextSelected: boolean
}

export interface DrawingPropertiesProps {
  isDrawing: boolean
  brushSize: number
  brushColor: string
}

interface MemeEditorContextType {
  canvas: Canvas | null
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  activeObject: boolean
  currentBackgroundColor: string
  selectedTextProperties: SelectedTextPropertiesProps
  isImageSelected: boolean
  drawingSettings: DrawingPropertiesProps
  setBackgroundImage: (imageUrl: string) => Promise<Canvas | null>
  addText: () => void
  addImage: (file: File) => Promise<void>
  changeFontFamily: (fontFamily: string) => void
  changeTextColor: (color: string) => void
  flipImage: (direction: 'horizontal' | 'vertical') => void
  changeBackgroundColor: (color: string) => void
  deleteSelectedObject: () => void
  downloadCanvas: () => void
  toggleDrawingMode: () => void
  incrementBrushSize: () => void
  setBrushColor: (color: string) => void
}

const MemeEditorContext = createContext<MemeEditorContextType | undefined>(undefined)

export function MemeEditorProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    useState<string>(DEFAULT_BACKGROUND_COLOR)
  const [selectedTextProperties, setSelectedTextProperties] = useState<SelectedTextPropertiesProps>(
    {
      fontFamily: DEFAULT_FONT_FAMILY,
      fontColor: DEFAULT_FONT_COLOR,
      isTextSelected: false,
    }
  )
  const [activeObject, setActivateObject] = useState<boolean>(false)
  const [isImageSelected, setIsImageSelected] = useState<boolean>(false)
  const { windowSize } = useWindow()
  const [drawingSettings, setDrawingSettings] = useState<DrawingPropertiesProps>({
    isDrawing: false,
    brushSize: 4,
    brushColor: '#000000',
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: CANVAS_DIMENSIONS.width,
      height: CANVAS_DIMENSIONS.height,
    })

    setCanvas(fabricCanvas)
    fabricCanvas.backgroundColor = currentBackgroundColor

    fabricCanvas.on('object:added', (e) => {
      const object = e.target
      if (object) {
        object.set({
          cornerColor: '#FFF',
          cornerStyle: 'circle',
          borderColor: '#8a4fec',
          borderScaleFactor: 1.5,
          transparentCorners: false,
          borderOpacityWhenMoving: 1,
          cornerStrokeColor: '#8a4fec',
        })
        fabricCanvas.renderAll()
      }
    })

    const updateSelectedProperties = () => {
      const activeObject = fabricCanvas.getActiveObject()

      if (activeObject && activeObject.type === 'textbox') {
        setSelectedTextProperties({
          fontFamily: activeObject.get('fontFamily') as string,
          fontColor: activeObject.get('fill') as string,
          isTextSelected: true,
        })
      } else {
        setSelectedTextProperties({
          fontFamily: DEFAULT_FONT_FAMILY,
          fontColor: DEFAULT_FONT_COLOR,
          isTextSelected: false,
        })
      }

      setActivateObject(!!activeObject)
      setIsImageSelected(activeObject?.type === 'image')
    }

    fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas)
    fabricCanvas.freeDrawingBrush.color = drawingSettings.brushColor
    fabricCanvas.freeDrawingBrush.width = drawingSettings.brushSize

    fabricCanvas.on('selection:created', updateSelectedProperties)
    fabricCanvas.on('selection:updated', updateSelectedProperties)
    fabricCanvas.on('selection:cleared', updateSelectedProperties)
    fabricCanvas.on('object:modified', updateSelectedProperties)

    adjustCanvasSize(fabricCanvas)

    return () => {
      fabricCanvas.off('selection:created', updateSelectedProperties)
      fabricCanvas.off('selection:updated', updateSelectedProperties)
      fabricCanvas.off('selection:cleared', updateSelectedProperties)
      fabricCanvas.off('object:modified', updateSelectedProperties)
      fabricCanvas.dispose()
    }
  }, [])

  useEffect(() => {
    if (canvas) {
      adjustCanvasSize(canvas)
      canvas.renderAll()
    }
  }, [windowSize.width, windowSize.height])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && canvas?.getActiveObject()) {
        deleteSelectedObject()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canvas, deleteSelectedObject])

  useEffect(() => {
    if (!canvas) return
    canvas.isDrawingMode = drawingSettings.isDrawing
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingSettings.brushColor
      canvas.freeDrawingBrush.width = drawingSettings.brushSize
    }
    canvas.renderAll()
  }, [drawingSettings, canvas])

  useEffect(() => {
    if (canvas) {
      canvas.backgroundColor = currentBackgroundColor
      canvas.renderAll()
    }
  }, [canvas, currentBackgroundColor])

  function adjustCanvasSize(fabricCanvas: Canvas) {
    const containerWidth = Math.min(CANVAS_DIMENSIONS.width, window.innerWidth - 32)
    const scale = containerWidth / CANVAS_DIMENSIONS.width
    const height = Math.min(fabricCanvas.height! * scale, CANVAS_DIMENSIONS.maxHeight)

    fabricCanvas.setDimensions({
      width: CANVAS_DIMENSIONS.width * scale,
      height: height,
    })

    fabricCanvas.setZoom(scale)
  }

  async function setBackgroundImage(imageUrl: string): Promise<Canvas | null> {
    if (!canvas) return null

    const img = await FabricImage.fromURL(imageUrl)

    if (!img) {
      alert('Failed to load image')
      return null
    }

    const aspectRatio = img.width! / img.height!
    const newHeight = CANVAS_DIMENSIONS.width / aspectRatio

    canvas.setDimensions({
      width: CANVAS_DIMENSIONS.width,
      height: newHeight,
    })

    img.scaleToWidth(CANVAS_DIMENSIONS.width)
    img.set({
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
    })

    canvas.backgroundImage = img
    adjustCanvasSize(canvas)
    canvas.renderAll()

    return canvas
  }

  function addText() {
    if (!canvas) return

    const text = new fabric.Textbox(DEFAULT_TEXT_OPTIONS.text, {
      ...DEFAULT_TEXT_OPTIONS,
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      width: canvas.getWidth() * 0.8,
      originX: 'center',
      originY: 'center',
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  function changeFontFamily(fontFamily: string) {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === 'textbox') {
      const text = activeObject as fabric.Textbox
      text.set('fontFamily', fontFamily)

      setSelectedTextProperties((prev) => ({
        ...prev,
        fontFamily: fontFamily,
      }))

      canvas.renderAll()
    }
  }

  function changeTextColor(color: string) {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === 'textbox') {
      const text = activeObject as fabric.Textbox
      text.set('fill', color)

      setSelectedTextProperties((prev) => ({
        ...prev,
        fontColor: color,
      }))

      canvas.renderAll()
    }
  }

  async function addImage(file: File) {
    if (!canvas) return

    const imageUrl = URL.createObjectURL(file)
    const img = await FabricImage.fromURL(imageUrl)

    if (!img) {
      console.error('Failed to load image')
      return
    }

    const { width, height } = canvas
    const scale = Math.min((width! * 0.5) / img.width!, (height! * 0.5) / img.height!)

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: width! / 2,
      top: height! / 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
    })

    canvas.add(img)
    canvas.setActiveObject(img)
    canvas.renderAll()

    URL.revokeObjectURL(imageUrl)
  }

  function flipImage(direction: 'horizontal' | 'vertical') {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject && activeObject.type === 'image') {
      const image = activeObject as fabric.Image
      direction === 'horizontal'
        ? image.set('flipX', !image.flipX)
        : image.set('flipY', !image.flipY)

      canvas.renderAll()
    }
  }

  function toggleDrawingMode() {
    setDrawingSettings((prev) => ({
      ...prev,
      isDrawing: !prev.isDrawing,
    }))
  }

  function incrementBrushSize() {
    setDrawingSettings((prev) => {
      let newSize = prev.brushSize + 2
      if (newSize > 20) {
        newSize = 2
      }
      return { ...prev, brushSize: newSize }
    })
  }

  function setBrushColor(color: string) {
    setDrawingSettings((prev) => ({
      ...prev,
      brushColor: color,
    }))
  }

  function deleteSelectedObject() {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      canvas.remove(activeObject)
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  function downloadCanvas() {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3,
    })

    const link = document.createElement('a')
    link.href = dataURL
    link.download = 'meme.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function changeBackgroundColor(color: string) {
    if (canvas) {
      setCurrentBackgroundColor(color)
      canvas.backgroundColor = color
      canvas.renderAll()
    }
  }

  const contextValue = {
    canvas,
    canvasRef,
    activeObject,
    currentBackgroundColor,
    selectedTextProperties,
    isImageSelected,
    drawingSettings,
    setBackgroundImage,
    addText,
    addImage,
    changeFontFamily,
    changeTextColor,
    flipImage,
    changeBackgroundColor,
    deleteSelectedObject,
    downloadCanvas,
    toggleDrawingMode,
    incrementBrushSize,
    setBrushColor,
  }

  return <MemeEditorContext.Provider value={contextValue}>{children}</MemeEditorContext.Provider>
}

export function useMemeEditorContext() {
  const context = useContext(MemeEditorContext)
  if (context === undefined) {
    throw new Error('useMemeEditorContext must be used within a MemeEditorProvider')
  }
  return context
}

import React from 'react'
import { Switch } from './switch.js'
import { cn } from '#common/ui/lib/utils'

export default function ModeSwitch() {
  const [isHumoristic, setIsHumoristic] = React.useState(false)
  return (
    <div className="flex items-center font-medium space-x-4 p-6">
      <span className="text-sm  text-neutral-700">Serious</span>
      <Switch
        checked={isHumoristic}
        onCheckedChange={() => setIsHumoristic((v) => !v)}
        className={cn(
          isHumoristic ? '!bg-yellow-800' : '!bg-violet-800',
          'transition-colors duration-300'
        )}
      />
      <span className="text-sm  text-neutral-700">Humor</span>
    </div>
  )
}

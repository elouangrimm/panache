import { AppSidebar } from '#common/ui/components/app_sidebar'
import ModeSwitch from '#common/ui/components/mode_switch'
import { MessageInput } from '#common/ui/components/message_input'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#common/ui/components/sidebar'
import { useChat } from 'ai/react'
import React from 'react'
import { getTimeOfDay } from '#ai/ui/lib/time'

export default function Landing() {
  const { input, isLoading, handleInputChange, handleSubmit } = useChat()
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex w-full justify-between items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <div>
              <ModeSwitch />
            </div>
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4 lg:pt-64 h-full max-w-6xl w-full mx-auto">
          <h1 className="text-center text-5xl sm:text-7xl font-serif">Good {getTimeOfDay()}!</h1>
          <form className="w-full" onSubmit={handleSubmit}>
            <MessageInput
              className="w-full"
              value={input}
              onChange={handleInputChange}
              isGenerating={isLoading}
            />
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

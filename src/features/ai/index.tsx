'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// ============================================
// Constants
// ============================================

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://89.167.112.85:8000'

// ============================================
// Arrow Up Icon - Exact Vercel
// ============================================

function ArrowUpIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 16 16"
      fill="currentColor"
      strokeLinejoin="round"
      className={className}
    >
      <path
        clipRule="evenodd"
        d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
        fillRule="evenodd"
      />
    </svg>
  )
}

// ============================================
// Paperclip Icon - Exact Vercel (for attachments)
// ============================================

function PaperclipIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`-rotate-45 ${className}`}
      width={14}
      height={14}
      viewBox="0 0 16 16"
      fill="currentColor"
      strokeLinejoin="round"
    >
      <path
        clipRule="evenodd"
        d="M10.8591 1.70735C10.3257 1.70735 9.81417 1.91925 9.437 2.29643L3.19455 8.53886C2.56246 9.17095 2.20735 10.0282 2.20735 10.9222C2.20735 11.8161 2.56246 12.6734 3.19455 13.3055C3.82665 13.9376 4.68395 14.2927 5.57786 14.2927C6.47178 14.2927 7.32908 13.9376 7.96117 13.3055L14.2036 7.06304L14.7038 6.56287L15.7041 7.56321L15.204 8.06337L8.96151 14.3058C8.06411 15.2032 6.84698 15.7074 5.57786 15.7074C4.30875 15.7074 3.09162 15.2032 2.19422 14.3058C1.29682 13.4084 0.792664 12.1913 0.792664 10.9222C0.792664 9.65305 1.29682 8.43592 2.19422 7.53852L8.43666 1.29609C9.07914 0.653606 9.95054 0.292664 10.8591 0.292664C11.7678 0.292664 12.6392 0.653606 13.2816 1.29609C13.9241 1.93857 14.2851 2.80997 14.2851 3.71857C14.2851 4.62718 13.9241 5.49858 13.2816 6.14106L13.2814 6.14133L7.0324 12.3835C7.03231 12.3836 7.03222 12.3837 7.03213 12.3838C6.64459 12.7712 6.11905 12.9888 5.57107 12.9888C5.02297 12.9888 4.49731 12.7711 4.10974 12.3835C3.72217 11.9959 3.50444 11.4703 3.50444 10.9222C3.50444 10.3741 3.72217 9.8484 4.10974 9.46084L4.11004 9.46054L9.877 3.70039L10.3775 3.20051L11.3772 4.20144L10.8767 4.70131L5.11008 10.4612C5.11005 10.4612 5.11003 10.4612 5.11 10.4613C4.98779 10.5835 4.91913 10.7493 4.91913 10.9222C4.91913 11.0951 4.98782 11.2609 5.11008 11.3832C5.23234 11.5054 5.39817 11.5741 5.57107 11.5741C5.74398 11.5741 5.9098 11.5054 6.03206 11.3832L6.03233 11.3829L12.2813 5.14072C12.2814 5.14063 12.2815 5.14054 12.2816 5.14045C12.6586 4.7633 12.8704 4.25185 12.8704 3.71857C12.8704 3.18516 12.6585 2.6736 12.2813 2.29643C11.9041 1.91925 11.3926 1.70735 10.8591 1.70735Z"
        fillRule="evenodd"
      />
    </svg>
  )
}

// ============================================
// Main Component
// ============================================

export function AIPage() {
  const { auth } = useAuthStore()
  const token = auth.accessToken

  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { id: `msg-${Date.now()}`, role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }

    setIsLoading(true)

    // Create empty assistant message for streaming
    const assistantMessageId = `msg-${Date.now() + 1}`
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant' as const, content: '' }])

    try {
      const response = await fetch(`${API_URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message: userMessage.content,
          stream: true,
          auto_approve: true,
        }),
      })

      if (response.status === 401 || response.status === 403) {
        useAuthStore.getState().auth.reset()
        window.location.href = '/auth?error=token_expired'
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: `Error: ${response.status}` } : m))
        setIsLoading(false)
        return
      }

      // Streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (!reader) {
        const data = await response.json()
        setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: data.content || data.response || JSON.stringify(data) } : m))
        setIsLoading(false)
        return
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Split on double newlines for SSE events
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue
            if (!trimmedLine.startsWith('data: ')) continue

            const dataStr = trimmedLine.slice(6).trim()
            if (!dataStr) continue

            try {
              const data = JSON.parse(dataStr)

              // Handle different event types
              if (data.type === 'start' || data.type === 'reasoning') {
                // Optional: show thinking status
              } else if (data.type === 'response' || data.type === 'content' || data.type === 'text') {
                // Main response content - with delay for smooth streaming effect
                const newContent = data.content || data.text || ''
                setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: m.content + newContent } : m))
                // Delay for natural streaming feel (like ChatGPT)
                await new Promise(resolve => setTimeout(resolve, 30))
              } else if (data.type === 'done') {
                break
              } else if (data.type === 'error') {
                setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: `Error: ${data.content}` } : m))
              }
            } catch (e) {
              // Not JSON - treat as plain text content
              if (dataStr.length > 0 && dataStr !== '[DONE]') {
                setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: m.content + dataStr } : m))
              }
            }
          }
        }
      } catch (streamError) {
        // Stream error
      }
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: 'Error: Failed to connect' } : m))
    }

    setIsLoading(false)
    inputRef.current?.focus()
  }

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h1 className="text-xl font-semibold">AI Assistant</h1>
        </div>
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex min-w-0 max-w-3xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`group/message fade-in w-full animate-in duration-200 ${
                  message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                }`}
              >
                {message.role === 'user' ? (
                  // User message - right aligned with bubble
                  <div className="inline-block rounded-xl px-4 py-2 bg-muted text-foreground dark:bg-muted/90 max-w-[85%]">
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                ) : (
                  // AI message - left aligned
                  <div className="flex gap-3">
                    <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
                      <Sparkles className="size-4" />
                    </div>
                    <div className="whitespace-pre-wrap text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto w-full max-w-none">
                <div className="flex gap-3">
                  <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <span className="animate-pulse">Thinking</span>
                    <span className="inline-flex">
                      <span className="animate-bounce [animation-delay:0ms]">.</span>
                      <span className="animate-bounce [animation-delay:150ms]">.</span>
                      <span className="animate-bounce [animation-delay:300ms]">.</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area - Exact Vercel style */}
        <div className="sticky bottom-0 z-1 mx-auto w-full max-w-3xl px-2 pb-3 md:px-4">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border bg-background p-3 shadow-xs transition-all duration-200 focus-within:border-border hover:border-muted-foreground/50"
          >
            {/* Textarea area - expands upward */}
            <div className="flex flex-col">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message..."
                className="w-full resize-none border-0! border-none! bg-transparent px-2 py-2 text-base outline-none ring-0 [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-scrollbar]:hidden"
                disabled={isLoading}
                rows={1}
                style={{ minHeight: '44px', maxHeight: '200px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
            </div>

            {/* Toolbar - stays at bottom */}
            <div className="flex items-center justify-between pt-2">
              {/* Left buttons */}
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg p-1 transition-colors hover:bg-accent"
                  disabled={isLoading}
                >
                  <PaperclipIcon />
                </Button>
              </div>

              {/* Right - Send button */}
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="size-8 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
              >
                <ArrowUpIcon />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

// app/(staff)/staff/events/[id]/_components/StaffMessagesTab.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { sendMessage } from "@/lib/actions/events"
import { Send } from "lucide-react"

export default function StaffMessagesTab({ eventId, initialMessages, currentUserId, currentUserName }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`staff-messages-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          setMessages(prev => {
            const exists = prev.some(m => m.id === payload.new.id)
            if (exists) return prev
            return [...prev, payload.new]
          })
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [eventId])

  async function handleSend(e) {
    e.preventDefault()
    if (!newMessage.trim()) return
    setIsSending(true)

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      event_id: eventId,
      sender_id: currentUserId,
      content: newMessage,
      created_at: new Date().toISOString(),
      profiles: { full_name: currentUserName }
    }
    setMessages(prev => [...prev, optimisticMessage])
    setNewMessage("")

    await sendMessage(eventId, newMessage)
    setIsSending(false)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col h-[600px]">

      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-serif text-lg text-[#001B3C] font-semibold">
          Messages
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Direct communication with the event organiser
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Send size={20} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No messages yet</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserId
            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isOwn && (
                  <div className="w-7 h-7 rounded-full bg-[#1F477B] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {message.profiles?.full_name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
                  {!isOwn && (
                    <span className="text-xs text-gray-400 ml-1">
                      {message.profiles?.full_name || "Organiser"}
                    </span>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn
                      ? "bg-[#001B3C] text-white rounded-br-sm"
                      : "bg-[#F7F9FB] text-gray-800 rounded-bl-sm"
                  }`}>
                    {message.content}
                  </div>
                  <span className="text-xs text-gray-400 mx-1">
                    {new Date(message.created_at).toLocaleTimeString("en-US", {
                      hour: "numeric", minute: "2-digit", hour12: true
                    })}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message the organiser..."
            className="flex-1 px-4 py-2.5 bg-[#F7F9FB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#001B3C] transition-all"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="w-10 h-10 bg-[#001B3C] text-white rounded-xl flex items-center justify-center hover:bg-[#1F477B] transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  )
}
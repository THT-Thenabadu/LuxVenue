// app/(dashboard)/dashboard/events/[id]/_components/MessagesTab.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { sendMessage } from "@/lib/actions/events"
import { Send } from "lucide-react"

export default function MessagesTab({ eventId, initialMessages, currentUserId, currentUserName }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef(null)

  // scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // subscribe to realtime messages
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`messages-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          // when a new message arrives add it to the list
          setMessages(prev => {
            // avoid duplicates if the sender already added it optimistically
            const exists = prev.some(m => m.id === payload.new.id)
            if (exists) return prev
            return [...prev, payload.new]
          })
        }
      )
      .subscribe()

    // cleanup — unsubscribe when component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  async function handleSend(e) {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)

    // optimistic update — add message to UI immediately
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

    // send to server
    await sendMessage(eventId, newMessage)
    setIsSending(false)
  }

  function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  }

  // group messages by date
  function groupByDate(messages) {
    return messages.reduce((groups, message) => {
      const date = new Date(message.created_at).toDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(message)
      return groups
    }, {})
  }

  const groupedMessages = groupByDate(messages)

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col h-[600px]">

      {/* header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-serif text-lg text-[#001B3C] font-semibold">
          Messages
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Direct communication with your hotel coordinator
        </p>
      </div>

      {/* messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F9FB] flex items-center justify-center mb-3">
              <Send size={20} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 font-medium">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Send a message to your hotel coordinator
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>

              {/* date separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">
                  {new Date(date).toDateString() === new Date().toDateString()
                    ? "Today"
                    : formatDate(dateMessages[0].created_at)
                  }
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* messages for this date */}
              <div className="space-y-3">
                {dateMessages.map((message) => {
                  const isOwn = message.sender_id === currentUserId
                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* avatar */}
                      {!isOwn && (
                        <div className="w-7 h-7 rounded-full bg-[#1F477B] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {message.profiles?.full_name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}

                      {/* bubble */}
                      <div className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        {/* sender name — only for other people's messages */}
                        {!isOwn && (
                          <span className="text-xs text-gray-400 ml-1">
                            {message.profiles?.full_name || "Hotel coordinator"}
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
                          {formatTime(message.created_at)}
                        </span>
                      </div>

                    </div>
                  )
                })}
              </div>

            </div>
          ))
        )}

        {/* scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* input area */}
      <div className="px-6 py-4 border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 bg-[#F7F9FB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#001B3C] transition-all"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="w-10 h-10 bg-[#001B3C] text-white rounded-xl flex items-center justify-center hover:bg-[#1F477B] transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  )
}
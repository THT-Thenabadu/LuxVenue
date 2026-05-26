// app/(auth)/confirm/page.jsx
import Link from "next/link"

export default function ConfirmPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-[#001B3C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✉️</span>
        </div>
        <h1 className="font-serif text-3xl text-[#001B3C] font-semibold mb-4">
          Check your email
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          We sent a confirmation link to your email address.
          Click the link to activate your account and get started.
        </p>
        <Link
          href="/auth/signin"
          className="text-sm text-[#001B3C] font-semibold hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
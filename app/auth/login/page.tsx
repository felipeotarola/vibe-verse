import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container flex items-center justify-center min-h-screen px-4 py-12 mx-auto">
        <LoginForm />
      </div>
    </main>
  )
}


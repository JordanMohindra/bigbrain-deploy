"use client"

import { Outlet, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/use-auth"
import { ThemeToggle } from "../common/theme-provider"

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            BigBrain
          </Link>
          <div className="flex items-center gap-4">
            {/* Add ThemeToggle here */}
            <ThemeToggle />

            {user && (
              <>
                <span className="hidden md:inline">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="btn bg-primary-700 hover:bg-primary-800 text-primary-foreground"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-muted border-t border-border">
        <div className="container mx-auto px-4 py-4 text-center text-muted-foreground">
          &copy; 2023 BigBrain Quiz App
        </div>
      </footer>
    </div>
  )
}

export default AdminLayout

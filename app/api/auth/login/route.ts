import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import userStorage from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    console.log(`Login attempt for: ${username}`)
    console.log(`Total registered users: ${userStorage.getUserCount()}`)

    // Find user
    const user = userStorage.findUser(username, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Create session
    const sessionData = {
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    console.log(`User ${username} logged in successfully`)
    return NextResponse.json({ message: "Login successful" })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 })
  }
}

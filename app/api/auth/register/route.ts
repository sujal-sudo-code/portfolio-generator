import { type NextRequest, NextResponse } from "next/server"
import userStorage from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, username, password } = await request.json()

    // Validate required fields
    if (!fullName || !email || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    if (userStorage.userExists(username, email)) {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      fullName,
      email,
      username,
      password, // In production: await bcrypt.hash(password, 10)
      createdAt: new Date().toISOString(),
    }

    userStorage.addUser(newUser)

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}

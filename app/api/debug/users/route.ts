import { type NextRequest, NextResponse } from "next/server"
import userStorage from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    const users = userStorage.getAllUsers()

    // Return users without passwords for security
    const safeUsers = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    }))

    return NextResponse.json({
      count: users.length,
      users: safeUsers,
    })
  } catch (error) {
    console.error("Debug users error:", error)
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 })
  }
}

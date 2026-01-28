import fs from "fs"
import path from "path"

const STORAGE_FILE = path.join(process.cwd(), "data", "users.json")

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(STORAGE_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Load users from file
function loadUsers() {
  ensureDataDir()
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading users:", error)
  }
  return []
}

// Save users to file
function saveUsers(users: any[]) {
  ensureDataDir()
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(users, null, 2))
    console.log(`[Storage] Saved ${users.length} users to file`)
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

const userStorage = {
  users: [] as any[],

  addUser(user: any) {
    console.log(`[Storage] Adding user: ${user.username}`)
    this.users.push(user)
    saveUsers(this.users)
  },

  findUser(username: string, password: string) {
    // Reload users from file each time (ensures fresh data)
    this.users = loadUsers()
    console.log(`[Storage] Searching for: ${username}`)
    console.log(`[Storage] Total users in memory: ${this.users.length}`)
    const user = this.users.find((u) => u.username === username && u.password === password)
    console.log(`[Storage] Found: ${user ? user.username : "NOT FOUND"}`)
    return user
  },

  userExists(username: string, email: string) {
    // Reload users from file
    this.users = loadUsers()
    return this.users.some((u) => u.username === username || u.email === email)
  },

  getAllUsers() {
    this.users = loadUsers()
    return this.users
  },

  getUserCount() {
    this.users = loadUsers()
    return this.users.length
  },
}

export default userStorage
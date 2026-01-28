"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Download, Eye, User, Briefcase, GraduationCap, Mail, Plus, Trash2 } from "lucide-react"
import PortfolioPreview from "@/components/portfolio-preview"

interface Project {
  title: string
  description: string
}

interface Education {
  degree: string
  school: string
  year: string
}

interface PortfolioData {
  name: string
  profilePicture: string
  about: string
  projects: Project[]
  skills: string[]
  education: Education[]
  email: string
  phone: string
  website: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: "",
    profilePicture: "",
    about: "",
    projects: [{ title: "", description: "" }],
    skills: [""],
    education: [{ degree: "", school: "", year: "" }],
    email: "",
    phone: "",
    website: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("form")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        // Pre-fill some data from user registration
        setPortfolioData((prev) => ({
          ...prev,
          name: userData.fullName || "",
          email: userData.email || "",
        }))
      } else {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field: "projects" | "skills" | "education", index: number, value: any) => {
    setPortfolioData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: "projects" | "skills" | "education") => {
    const newItem =
      field === "projects"
        ? { title: "", description: "" }
        : field === "skills"
          ? ""
          : { degree: "", school: "", year: "" }

    setPortfolioData((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }))
  }

  const removeArrayItem = (field: "projects" | "skills" | "education", index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const generatePortfolio = async () => {
    setIsGenerating(true)
    setMessage("")

    try {
      const response = await fetch("/api/portfolio/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolioData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `${portfolioData.name.replace(/\s+/g, "_")}_portfolio.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        setMessage("Portfolio generated and downloaded successfully!")
      } else {
        const data = await response.json()
        setMessage(data.error || "Failed to generate portfolio")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Builder</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.fullName}</span>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Portfolio Form</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic information about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={portfolioData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profilePicture">Profile Picture URL (Optional)</Label>
                    <Input
                      id="profilePicture"
                      value={portfolioData.profilePicture}
                      onChange={(e) => handleInputChange("profilePicture", e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="about">About Section</Label>
                  <Textarea
                    id="about"
                    value={portfolioData.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    placeholder="Tell us about yourself, your experience, and what you do..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Projects
                </CardTitle>
                <CardDescription>Showcase your work and projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioData.projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Project {index + 1}</h4>
                      {portfolioData.projects.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("projects", index)}
                          className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        value={project.title}
                        onChange={(e) => handleArrayChange("projects", index, { ...project, title: e.target.value })}
                        placeholder="Project title"
                      />
                      <Textarea
                        value={project.description}
                        onChange={(e) =>
                          handleArrayChange("projects", index, { ...project, description: e.target.value })
                        }
                        placeholder="Project description"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem("projects")}
                  className="w-full bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>List your technical and professional skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleArrayChange("skills", index, e.target.value)}
                      placeholder="Enter a skill"
                      className="flex-1"
                    />
                    {portfolioData.skills.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("skills", index)}
                        className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem("skills")}
                  className="w-full bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioData.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      {portfolioData.education.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("education", index)}
                          className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleArrayChange("education", index, { ...edu, degree: e.target.value })}
                        placeholder="Degree/Certificate"
                      />
                      <Input
                        value={edu.school}
                        onChange={(e) => handleArrayChange("education", index, { ...edu, school: e.target.value })}
                        placeholder="School/Institution"
                      />
                      <Input
                        value={edu.year}
                        onChange={(e) => handleArrayChange("education", index, { ...edu, year: e.target.value })}
                        placeholder="Year"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem("education")}
                  className="w-full bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>How people can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={portfolioData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={portfolioData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={portfolioData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {message && (
              <Alert
                className={message.includes("success") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
              >
                <AlertDescription className={message.includes("success") ? "text-green-800" : "text-red-800"}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                onClick={() => setActiveTab("preview")}
                variant="outline"
                className="bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Portfolio
              </Button>
              <Button
                onClick={generatePortfolio}
                disabled={isGenerating || !portfolioData.name.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate & Download"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <PortfolioPreview data={portfolioData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

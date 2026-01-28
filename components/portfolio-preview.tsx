import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Globe, GraduationCap, Briefcase, User } from "lucide-react"

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

interface PortfolioPreviewProps {
  data: PortfolioData
}

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {data.profilePicture ? (
              <img
                src={data.profilePicture || "/placeholder.svg"}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-white/70" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{data.name || "Your Name"}</h1>
            <p className="text-xl text-white/90">Professional Portfolio</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* About Section */}
        {data.about && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.about}</p>
          </section>
        )}

        {/* Skills Section */}
        {data.skills.some((skill) => skill.trim()) && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects.some((project) => project.title.trim()) && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Projects
            </h2>
            <div className="grid gap-4">
              {data.projects
                .filter((project) => project.title.trim())
                .map((project, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-gray-700">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education.some((edu) => edu.degree.trim()) && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              Education
            </h2>
            <div className="space-y-4">
              {data.education
                .filter((edu) => edu.degree.trim())
                .map((edu, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.school}</p>
                      {edu.year && <p className="text-gray-500">{edu.year}</p>}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Contact
          </h2>
          <div className="flex flex-wrap gap-4">
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <Mail className="w-4 h-4" />
                {data.email}
              </a>
            )}
            {data.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <Phone className="w-4 h-4" />
                {data.phone}
              </a>
            )}
            {data.website && (
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

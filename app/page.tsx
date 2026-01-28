import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Briefcase, Download, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Portfolio Builder</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create stunning professional portfolios in minutes. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Easy Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quick and simple registration process. Just provide your basic information and you're ready to go.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Portfolio Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intuitive form-based interface to create your professional portfolio with live preview.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Download & Deploy</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get your complete portfolio as a ZIP file with HTML, CSS, and all assets ready to deploy.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Secure & Private</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your data is stored securely with session-based authentication. No external databases required - everything
            runs locally.
          </p>
        </div>
      </div>
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const portfolioData = await request.json()

    // Generate HTML content
    const htmlContent = generatePortfolioHTML(portfolioData)
    const cssContent = generatePortfolioCSS()

    // Create a simple ZIP-like response (in production, use a proper ZIP library)
    const files = {
      "index.html": htmlContent,
      "style.css": cssContent,
      "README.md": generateReadme(portfolioData.name),
    }

    // For demonstration, we'll return the HTML as a downloadable file
    // In production, you would use a library like JSZip to create actual ZIP files
    const response = new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${portfolioData.name.replace(/\s+/g, "_")}_portfolio.html"`,
      },
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate portfolio" }, { status: 500 })
  }
}

function generatePortfolioHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="profile-image">
                    ${
                      data.profilePicture
                        ? `<img src="${data.profilePicture}" alt="${data.name}">`
                        : '<i class="fas fa-user"></i>'
                    }
                </div>
                <div class="header-text">
                    <h1>${data.name}</h1>
                    <p>Professional Portfolio</p>
                </div>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            ${
              data.about
                ? `
            <section class="section">
                <h2><i class="fas fa-user"></i> About Me</h2>
                <p>${data.about}</p>
            </section>
            `
                : ""
            }

            ${
              data.skills.some((skill: string) => skill.trim())
                ? `
            <section class="section">
                <h2><i class="fas fa-cogs"></i> Skills</h2>
                <div class="skills">
                    ${data.skills
                      .filter((skill: string) => skill.trim())
                      .map((skill: string) => `<span class="skill">${skill}</span>`)
                      .join("")}
                </div>
            </section>
            `
                : ""
            }

            ${
              data.projects.some((project: any) => project.title.trim())
                ? `
            <section class="section">
                <h2><i class="fas fa-briefcase"></i> Projects</h2>
                <div class="projects">
                    ${data.projects
                      .filter((project: any) => project.title.trim())
                      .map(
                        (project: any) => `
                    <div class="project">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                    `,
                      )
                      .join("")}
                </div>
            </section>
            `
                : ""
            }

            ${
              data.education.some((edu: any) => edu.degree.trim())
                ? `
            <section class="section">
                <h2><i class="fas fa-graduation-cap"></i> Education</h2>
                <div class="education">
                    ${data.education
                      .filter((edu: any) => edu.degree.trim())
                      .map(
                        (edu: any) => `
                    <div class="education-item">
                        <h3>${edu.degree}</h3>
                        <p>${edu.school}</p>
                        ${edu.year ? `<span class="year">${edu.year}</span>` : ""}
                    </div>
                    `,
                      )
                      .join("")}
                </div>
            </section>
            `
                : ""
            }

            <section class="section">
                <h2><i class="fas fa-envelope"></i> Contact</h2>
                <div class="contact">
                    ${data.email ? `<a href="mailto:${data.email}"><i class="fas fa-envelope"></i> ${data.email}</a>` : ""}
                    ${data.phone ? `<a href="tel:${data.phone}"><i class="fas fa-phone"></i> ${data.phone}</a>` : ""}
                    ${data.website ? `<a href="${data.website}" target="_blank"><i class="fas fa-globe"></i> Website</a>` : ""}
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${data.name}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`
}

function generatePortfolioCSS(): string {
  return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 0;
    text-align: center;
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-image i {
    font-size: 60px;
    color: rgba(255, 255, 255, 0.7);
}

.header h1 {
    font-size: 3rem;
    margin-bottom: 10px;
}

.header p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.main {
    padding: 60px 0;
}

.section {
    background: white;
    margin-bottom: 40px;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.section h2 {
    font-size: 2rem;
    margin-bottom: 30px;
    color: #667eea;
    display: flex;
    align-items: center;
    gap: 15px;
}

.section h2 i {
    font-size: 1.5rem;
}

.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.skill {
    background: #e3f2fd;
    color: #1976d2;
    padding: 8px 16px;
    border-radius: 25px;
    font-weight: 500;
    font-size: 0.9rem;
}

.projects {
    display: grid;
    gap: 30px;
}

.project {
    border-left: 4px solid #667eea;
    padding-left: 20px;
}

.project h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #333;
}

.project p {
    color: #666;
    line-height: 1.6;
}

.education {
    display: grid;
    gap: 25px;
}

.education-item {
    border-left: 4px solid #667eea;
    padding-left: 20px;
    position: relative;
}

.education-item h3 {
    font-size: 1.3rem;
    margin-bottom: 5px;
    color: #333;
}

.education-item p {
    color: #666;
    margin-bottom: 5px;
}

.year {
    color: #999;
    font-size: 0.9rem;
}

.contact {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.contact a {
    color: #667eea;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    transition: color 0.3s ease;
}

.contact a:hover {
    color: #764ba2;
}

.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 30px 0;
}

@media (max-width: 768px) {
    .header h1 {
        font-size: 2rem;
    }
    
    .section {
        padding: 30px 20px;
    }
    
    .section h2 {
        font-size: 1.5rem;
    }
    
    .contact {
        flex-direction: column;
        gap: 15px;
    }
    
    .header-content {
        gap: 20px;
    }
    
    .profile-image {
        width: 120px;
        height: 120px;
    }
}`
}

function generateReadme(name: string): string {
  return `# ${name} - Portfolio

This portfolio was generated using the Portfolio Builder System.

## Files Included

- index.html - Main portfolio page
- style.css - Styling for the portfolio
- README.md - This file

## Deployment

You can deploy this portfolio to any web hosting service:

1. Upload all files to your web server
2. Ensure index.html is in the root directory
3. Your portfolio will be accessible at your domain

## Customization

Feel free to modify the HTML and CSS files to further customize your portfolio.

Generated on: ${new Date().toLocaleDateString()}
`
}

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import { SectionType } from '../types/portfolio';
import JSZip from 'jszip';

interface Props {
  onClose: () => void;
}

export const ExportModal: React.FC<Props> = ({ onClose }) => {
  const [exporting, setExporting] = useState(false);
  const portfolio = usePortfolioStore((state) => state.portfolio);

  const handleExport = async () => {
    if (!portfolio) return;
    
    setExporting(true);
    
    try {
      const zip = new JSZip();
      
      // Add index.html
      const html = generateHTML(portfolio);
      zip.file('index.html', html);
      
      // Add styles.css
      const css = generateCSS(portfolio);
      zip.file('styles.css', css);
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Export Portfolio</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Your portfolio will be exported as a static website in a ZIP file. The package includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>HTML file with your content</li>
            <li>CSS file with your custom styles</li>
            <li>Optimized assets and dependencies</li>
          </ul>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                'Export'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function generateHTML(portfolio: Portfolio): string {
  const { template, sections, customStyles } = portfolio;
  const styles = customStyles?.colors || template.styles;
  const fonts = customStyles?.fonts || { heading: 'Inter', body: 'Inter' };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.title}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=${fonts.heading}&family=${fonts.body}&display=swap" rel="stylesheet">
</head>
<body>
    <div id="portfolio" class="portfolio-container">
        ${sections.map(section => generateSectionHTML(section)).join('\n')}
    </div>
</body>
</html>`;
}

function generateSectionHTML(section: PortfolioSection): string {
  const content = section.content || {};
  
  switch (section.type) {
    case SectionType.ABOUT:
      return `
        <section id="${section.type}" class="section about-section">
          <h2>${section.title}</h2>
          ${content.name ? `<h1 class="name">${content.name}</h1>` : ''}
          ${content.title ? `<p class="title">${content.title}</p>` : ''}
          ${content.bio ? `<p class="bio">${content.bio}</p>` : ''}
          ${content.avatar ? `<img src="${content.avatar}" alt="${content.name}" class="avatar">` : ''}
          ${content.socialLinks?.length ? `
            <div class="social-links">
              ${content.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.platform}</a>
              `).join('')}
            </div>
          ` : ''}
        </section>`;

    case SectionType.PROJECTS:
      return `
        <section id="${section.type}" class="section projects-section">
          <h2>${section.title}</h2>
          <div class="projects-grid">
            ${content.projects?.map((project: ProjectContent) => `
              <div class="project-card">
                ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-image">` : ''}
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="technologies">
                  ${project.technologies?.map((tech: string) => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                  ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
                  ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>`;

    case SectionType.SKILLS:
      return `
        <section id="${section.type}" class="section skills-section">
          <h2>${section.title}</h2>
          ${content.categories?.map((category: SkillContent) => `
            <div class="skill-category">
              <h3>${category.category}</h3>
              <div class="skills-grid">
                ${category.skills?.map((skill: { name: string; level: number }) => `
                  <div class="skill-item">
                    <span class="skill-name">${skill.name}</span>
                    <div class="skill-level" style="--level: ${skill.level}%"></div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </section>`;

    case SectionType.EXPERIENCE:
      return `
        <section id="${section.type}" class="section experience-section">
          <h2>${section.title}</h2>
          <div class="timeline">
            ${content.experiences?.map((exp: ExperienceContent) => `
              <div class="timeline-item">
                <div class="timeline-content">
                  <h3>${exp.position} at ${exp.company}</h3>
                  <p class="timeline-period">${exp.startDate} - ${exp.endDate || 'Present'}</p>
                  <p>${exp.description}</p>
                  ${exp.achievements?.length ? `
                    <ul class="achievements">
                      ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>`;

    case SectionType.EDUCATION:
      return `
        <section id="${section.type}" class="section education-section">
          <h2>${section.title}</h2>
          <div class="education-grid">
            ${content.education?.map((edu: EducationContent) => `
              <div class="education-card">
                <h3>${edu.institution}</h3>
                <p class="degree">${edu.degree} in ${edu.field}</p>
                <p class="period">${edu.startDate} - ${edu.endDate || 'Present'}</p>
                ${edu.gpa ? `<p class="gpa">GPA: ${edu.gpa}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>`;

    case SectionType.CERTIFICATIONS:
      return `
        <section id="${section.type}" class="section certifications-section">
          <h2>${section.title}</h2>
          <div class="certifications-grid">
            ${content.certifications?.map((cert: CertificationContent) => `
              <div class="certification-card">
                <h3>${cert.name}</h3>
                <p class="issuer">Issued by ${cert.issuer}</p>
                <p class="date">Issued: ${cert.issueDate}</p>
                ${cert.expiryDate ? `<p class="expiry">Expires: ${cert.expiryDate}</p>` : ''}
                ${cert.credentialUrl ? `
                  <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="verify-link">
                    Verify Credential
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>`;

    case SectionType.CONTACT:
      return `
        <section id="${section.type}" class="section contact-section">
          <h2>${section.title}</h2>
          <div class="contact-info">
            <p class="email">Email: <a href="mailto:${content.email}">${content.email}</a></p>
            ${content.phone ? `<p class="phone">Phone: ${content.phone}</p>` : ''}
            ${content.location ? `<p class="location">Location: ${content.location}</p>` : ''}
            <p class="preferred-contact">Preferred Contact Method: ${content.preferredContact}</p>
          </div>
        </section>`;

    case SectionType.BLOG:
      return `
        <section id="${section.type}" class="section blog-section">
          <h2>${section.title}</h2>
          <div class="blog-grid">
            ${content.posts?.map((post: BlogContent['posts'][0]) => `
              <article class="blog-card">
                <h3><a href="${post.url}" target="_blank" rel="noopener noreferrer">${post.title}</a></h3>
                <p class="date">${post.date}</p>
                <p class="excerpt">${post.excerpt}</p>
                <a href="${post.url}" class="read-more" target="_blank" rel="noopener noreferrer">Read More</a>
              </article>
            `).join('')}
          </div>
        </section>`;

    case SectionType.OPEN_SOURCE:
      return `
        <section id="${section.type}" class="section opensource-section">
          <h2>${section.title}</h2>
          <div class="contributions-grid">
            ${content.contributions?.map((contrib: OpenSourceContent['contributions'][0]) => `
              <div class="contribution-card">
                <h3><a href="${contrib.url}" target="_blank" rel="noopener noreferrer">${contrib.project}</a></h3>
                <p class="type">${contrib.type}</p>
                <p class="description">${contrib.description}</p>
              </div>
            `).join('')}
          </div>
        </section>`;

    case SectionType.TESTIMONIALS:
      return `
        <section id="${section.type}" class="section testimonials-section">
          <h2>${section.title}</h2>
          <div class="testimonials-grid">
            ${content.testimonials?.map((testimonial: TestimonialContent['testimonials'][0]) => `
              <div class="testimonial-card">
                ${testimonial.avatar ? `<img src="${testimonial.avatar}" alt="${testimonial.name}" class="avatar">` : ''}
                <blockquote>${testimonial.content}</blockquote>
                <cite>
                  <strong>${testimonial.name}</strong>
                  <span>${testimonial.position} at ${testimonial.company}</span>
                </cite>
              </div>
            `).join('')}
          </div>
        </section>`;

    case SectionType.RESUME:
      return `
        <section id="${section.type}" class="section resume-section">
          <h2>${section.title}</h2>
          <div class="resume-download">
            <p>Last Updated: ${content.lastUpdated}</p>
            <a href="${content.fileUrl}" target="_blank" rel="noopener noreferrer" class="download-button">
              Download Resume
            </a>
          </div>
        </section>`;

    default:
      return `
        <section id="${section.type}" class="section">
          <h2>${section.title}</h2>
          <p>Content not available</p>
        </section>`;
  }
}

function generateCSS(portfolio: Portfolio): string {
  const { template, customStyles } = portfolio;
  const styles = customStyles?.colors || template.styles;
  const fonts = customStyles?.fonts || { heading: 'Inter', body: 'Inter' };

  return `
:root {
  --color-primary: ${styles.primary};
  --color-secondary: ${styles.secondary};
  --color-accent: ${styles.accent};
  --color-background: ${styles.background};
  --color-text: ${styles.text};
  --font-heading: '${fonts.heading}', sans-serif;
  --font-body: '${fonts.body}', sans-serif;
}

/* Base Styles */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: 1.6;
}

.portfolio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section {
  margin-bottom: 4rem;
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-primary);
  margin-top: 0;
}

/* About Section */
.about-section .name {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.about-section .title {
  font-size: 1.25rem;
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
}

.about-section .bio {
  line-height: 1.6;
  margin-bottom: 2rem;
}

.about-section .avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-links a {
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
}

.social-links a:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Projects Section */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-card h3 {
  margin: 1rem;
}

.project-card p {
  margin: 0 1rem 1rem;
  color: var(--color-secondary);
}

.technologies {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.project-links {
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

.project-links a {
  color: var(--color-accent);
  text-decoration: none;
}

/* Skills Section */
.skill-category {
  margin-bottom: 2rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.skill-item {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 0.25rem;
}

.skill-level {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
  overflow: hidden;
}

.skill-level::after {
  content: '';
  display: block;
  height: 100%;
  width: var(--level);
  background-color: var(--color-accent);
  border-radius: 0.25rem;
}

/* Experience Section */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--color-secondary);
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 0.5rem;
  width: 1rem;
  height: 1rem;
  background-color: var(--color-accent);
  border-radius: 50%;
}

.timeline-period {
  color: var(--color-secondary);
  font-size: 0.875rem;
}

.achievements {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

/* Education Section */
.education-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.education-card {
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.02);
}

.education-card .degree {
  color: var(--color-secondary);
  margin: 0.5rem 0;
}

.education-card .period {
  font-size: 0.875rem;
  color: var(--color-secondary);
}

/* Certifications Section */
.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.certification-card {
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.verify-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-accent);
  text-decoration: none;
}

/* Contact Section */
.contact-info {
  max-width: 600px;
  margin: 0 auto;
}

.contact-info p {
  margin: 1rem 0;
}

.contact-info a {
  color: var(--color-accent);
  text-decoration: none;
}

/* Blog Section */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.blog-card {
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.blog-card .date {
  color: var(--color-secondary);
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

.read-more {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-accent);
  text-decoration: none;
}

/* Open Source Section */
.contributions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.contribution-card {
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.contribution-card .type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

/* Testimonials Section */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.testimonial-card {
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.02);
  text-align: center;
}

.testimonial-card .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.testimonial-card blockquote {
  font-style: italic;
  margin: 1rem 0;
}

.testimonial-card cite {
  display: block;
  margin-top: 1rem;
}

.testimonial-card cite strong {
  display: block;
  color: var(--color-primary);
}

.testimonial-card cite span {
  font-size: 0.875rem;
  color: var(--color-secondary);
}

/* Resume Section */
.resume-download {
  text-align: center;
  padding: 2rem;
}

.download-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: 0.25rem;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.download-button:hover {
  background-color: var(--color-primary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .portfolio-container {
    padding: 1rem;
  }

  .section {
    padding: 1.5rem;
  }

  .projects-grid,
  .education-grid,
  .certifications-grid,
  .blog-grid,
  .contributions-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .about-section .avatar {
    width: 150px;
    height: 150px;
  }
}`;
}
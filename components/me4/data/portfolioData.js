/**
 * PORTFOLIO DATA STORE
 * Harshavardhan J — AWS Cloud × DevOps
 * Coimbatore, India
 * Fresher / Entry-Level Portfolio
 */

export const personalInfo = {
  name: "HARSHAVARDHAN J",
  shortName: "HARSHA",
  tagline: "AWS CLOUD × DEVOPS",
  role: "AWS Cloud & DevOps Fresher",
  location: "Coimbatore, India",
  status: "Open to entry-level opportunities, internships & projects",
  email: "harshavardhanj6705@gmail.com",
  github: "https://github.com/Harshavardhan6705",
  linkedin: "https://www.linkedin.com/in/harshavardhan-cloud",
  bioHeadline: "Building practical skills in AWS Cloud and DevOps, with a focus on cloud infrastructure, automation, containers, CI/CD, and reliable application deployment.",
  aboutParagraphs: [
    "I am a Computer Technology graduate preparing for a career in AWS Cloud and DevOps. I learn by building practical projects and working with modern cloud and deployment technologies.",
    "My current focus includes AWS services, cloud infrastructure, containerization, CI/CD, Linux, infrastructure as code, and monitoring.",
    "I am continuously improving my technical skills and looking for opportunities to apply what I learn in real-world cloud environments."
  ],
  highlights: [
    "B.Sc. Computer Technology",
    "AWS Cloud & DevOps career focus",
    "Hands-on project-based learning",
    "Fresher / Entry Level"
  ],
  heroStats: [
    "B.Sc. COMPUTER TECHNOLOGY",
    "AWS CLOUD & DEVOPS",
    "FRESHER"
  ]
};

export const skillsCategories = [
  {
    category: "Cloud",
    icon: "Cloud",
    description: "Core AWS services for compute, storage, identity, networking, and monitoring.",
    skills: ["AWS", "EC2", "S3", "IAM", "VPC", "RDS", "CloudWatch"]
  },
  {
    category: "DevOps",
    icon: "Wrench",
    description: "Version control, automation, and infrastructure tooling for modern delivery workflows.",
    skills: ["Git", "GitHub", "Jenkins", "Docker", "Terraform", "Ansible"]
  },
  {
    category: "CI/CD",
    icon: "Workflow",
    description: "Automated build and deployment pipelines for reliable application releases.",
    skills: ["AWS CodePipeline", "AWS CodeDeploy", "CI/CD"]
  }
];

export const projectsData = [
  {
    id: "url-security-scanner",
    title: "URL Security Scanner",
    category: "Cybersecurity / Web Application",
    description: "Analyzes URLs to identify phishing and suspicious indicators, calculates a risk score based on detected security signals, and classifies websites as Safe, Suspicious, or Dangerous.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1600&auto=format&fit=crop",
    tags: ["TypeScript", "Web Application", "Cybersecurity", "Phishing Detection"],
    repoUrl: "https://github.com/Harshavardhan6705/SecureLink-AI",
    overlayLabel: "VIEW URL SCANNER",
    overview: "SecureLink Scanner inspects a submitted link, breaks it into its RFC 3986 parts (protocol, domain, subdomain, port, path, query), checks it against layered security heuristics, and returns an explainable 0–100 risk score with a full technical breakdown.",
    highlights: [
      "Protocol checks — flags plain HTTP, unusual ports and dangerous javascript:, data: and vbscript: links",
      "Brand spoofing detection for look-alike PayPal, Apple, Google, Microsoft and bank domains",
      "Raw IP and SSRF detection, including private networks and the cloud metadata address",
      "High-abuse TLD profiling (.zip, .mov, .xyz, .top) and link-shortener / open-redirect detection",
      "Shannon entropy scoring to catch algorithmically generated (DGA) domains",
      "Explainable score: 0–30 Low, 31–60 Medium, 61–80 High, 81–100 Critical, with itemised points",
      "Dashboard with pass / warning / danger cards, local scan history and .txt / .json report export",
      "Express POST /api/scan endpoint protected by SSRF filters"
    ],
    techStack: ["TypeScript", "Node.js", "Express", "REST API"]
  },
  {
    id: "error-explanation-assistant",
    title: "Error Explanation Assistant",
    category: "AI / Educational Tool",
    description: "Analyzes programming errors and explains them in simple language, identifies what went wrong and where the error occurred, and provides beginner-friendly guidance to help fix the problem.",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop",
    fullImage: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1600&auto=format&fit=crop",
    tags: ["JavaScript", "WebAssembly", "Debugging", "Education"],
    repoUrl: "https://github.com/Harshavardhan6705/Error-Explanation-assistant-",
    overlayLabel: "VIEW ERROR ASSISTANT",
    overview: "Pick a language, write or upload a program and press Run. Successful programs show their real output; failing ones show the real error plus a beginner-friendly explanation in eight parts: error type, message, location, what happened, why, how to fix it, corrected code and a simple example.",
    highlights: [
      "Supports Python, Java, C++, JavaScript, HTML and CSS",
      "Every program runs in an isolated sandbox — never directly on the host",
      "Python via Pyodide (WebAssembly) and Java via the real OpenJDK 8 compiler and JVM in the browser",
      "C++ compiled with Clang to WebAssembly on the backend and run with no filesystem or network access",
      "Parses real tracebacks and compiler diagnostics to find the error type, message, line and column",
      "Static analyzers and a per-language knowledge base supply the exact fix and corrected code",
      "Backend limits: time, memory and output caps, a compile queue and 30 runs per minute per IP"
    ],
    techStack: ["JavaScript", "Node.js", "WebAssembly", "Pyodide", "HTML", "CSS"]
  }
];

export const learningJourney = [
  {
    year: "2023 — 2026",
    role: "Sri Krishna Arts and Science College, Coimbatore",
    milestone: "B.Sc. Computer Technology",
    description: "Built a foundation in computer technology through coursework and hands-on project work spanning programming, networks, operating systems, and software development practices."
  },
  {
    year: "Schooling",
    role: "Ashram Matriculation Higher Secondary School",
    milestone: "Higher Secondary",
    description: "Completed higher secondary education, building the analytical and problem-solving foundation for further technical study."
  }
];

export const certifications = [
  {
    title: "AWS Certified DevOps Engineer – Professional Specialization",
    issuer: "Coursera",
    icon: "Cloud",
    credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/JWWYQ1DX0AXJ"
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    icon: "Award",
    credentialUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=C48DE90E6301FBC81F6FC44015F8454136422E8C34469CEBDEB25D72C1109471"
  },
  {
    title: "DevOps Complete Course",
    issuer: "Coursera",
    icon: "Cloud",
    credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/certificate/D38OY2X56637"
  },
  {
    title: "Foundations of DevOps and Git",
    issuer: "Coursera",
    icon: "Cloud",
    credentialUrl: "https://www.coursera.org/account/accomplishments/certificate/AS0ZO2T0Y1K2"
  },
  {
    title: "Introduction to Cloud Computing",
    issuer: "Simplilearn",
    icon: "Cloud",
    credentialUrl: "https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiI0ODcwIiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvMTA4NTgzNzVfOTUyMDk2Nl8xNzkxNDczOTQ5NzE0LnBuZyIsInVzZXJuYW1lIjoiSEFSU0hBVkFSREhBTiBKIn0%3D&referrer=https%3A%2F%2Flms.simplilearn.com%2Fcourses%2F7836%2FPrompt-Engineering-Application%2Fcertificate%2Fdownload-skillup&%24web_only=true"
  },
  {
    title: "Prompt Engineering Applications",
    issuer: "Simplilearn",
    icon: "Award",
    credentialUrl: "https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiI0ODcwIiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvMTA4NTgzNzVfOTUyMDk2Nl8xNzkxNDczOTQ5NzE0LnBuZyIsInVzZXJuYW1lIjoiSEFSU0hBVkFSREhBTiBKIn0%3D&referrer=https%3A%2F%2Flms.simplilearn.com%2Fcourses%2F7836%2FPrompt-Engineering-Application%2Fcertificate%2Fdownload-skillup&%24web_only=true"
  }
];

export const socialLinks = [
  { label: "GitHub", url: "https://github.com/Harshavardhan6705" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/harshavardhan-cloud" }
];

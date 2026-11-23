import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting Axion Technologies database seed...");

  // 1. Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Full system administration and control",
      permissions: JSON.stringify(["*"]),
    },
  });

  await prisma.role.upsert({
    where: { name: "EDITOR" },
    update: {},
    create: {
      name: "EDITOR",
      description: "Content and portfolio management access",
      permissions: JSON.stringify(["projects:*", "services:*", "products:*", "blog:*", "inquiries:read"]),
    },
  });

  // 2. Default Admin User
  const passwordHash = await bcrypt.hash("Admin@Axion2026!", 10);
  for (const email of ["admin@axionsoft.solution", "admin@axiontech.in"]) {
    await prisma.adminUser.upsert({
      where: { email },
      update: {
        passwordHash,
        roleId: superAdminRole.id,
      },
      create: {
        email,
        name: "AxionSoft Lead Administrator",
        passwordHash,
        roleId: superAdminRole.id,
        isActive: true,
      },
    });
  }
  console.log("✓ Admin users configured: admin@axionsoft.solution & admin@axiontech.in");

  // 3. Company Settings
  const settings = [
    { key: "company_name", value: "AXIONSOFT SOLUTION", description: "Official business trade name" },
    { key: "company_tagline", value: "WE BUILD WHAT'S NEXT.", description: "Brand motto and primary tagline" },
    { key: "company_mission", value: "Transform complex ideas into useful, intelligent, scalable and secure digital products.", description: "Core enterprise mission" },
    { key: "company_vision", value: "Become a trusted technology partner for businesses, startups and organizations by delivering innovative software, AI solutions and secure digital infrastructure.", description: "Long-term vision" },
    { key: "contact_email", value: "contact@axiontech.in", description: "Public inquiry email" },
    { key: "contact_phone", value: "+91 (80) 4920-8000", description: "Business telephone line" },
    { key: "office_location", value: "Bengaluru, Karnataka, India", description: "Primary headquarters location" },
    { key: "social_github", value: "https://github.com/axion-technologies", description: "GitHub profile" },
    { key: "social_linkedin", value: "https://linkedin.com/company/axion-technologies", description: "LinkedIn company page" },
    { key: "social_x", value: "https://x.com/axiontech_in", description: "X / Twitter account" },
    { key: "brand_accent", value: "#B6FF5C", description: "Primary accent color (Electric Lime)" },
    { key: "brand_background", value: "#101010", description: "Dark theme primary background" },
  ];

  for (const s of settings) {
    await prisma.companySetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }
  console.log("✓ Company settings initialized");

  // 4. Service Categories and Services
  const serviceCategories = [
    { name: "Core Engineering", slug: "core-engineering", description: "High-performance software and systems engineering" },
    { name: "Artificial Intelligence", slug: "artificial-intelligence", description: "Intelligent agent systems and applied machine learning" },
    { name: "Digital Solutions", slug: "digital-solutions", description: "Scalable web and cross-platform applications" },
    { name: "Security & Infrastructure", slug: "security-infra", description: "Zero-trust cybersecurity and resilient cloud architectures" },
  ];

  const catMap = new Map<string, string>();
  for (const cat of serviceCategories) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    catMap.set(cat.slug, created.id);
  }

  const servicesData = [
    {
      slug: "software",
      title: "Software Engineering",
      tagline: "Architecting Mission-Critical Distributed Systems",
      categorySlug: "core-engineering",
      shortDesc: "Enterprise software, microservices, robust APIs, and resilient data architectures engineered for extreme reliability.",
      description: "We build high-concurrency, failure-tolerant enterprise software platforms tailored to complex business domains. From custom ERP engines to high-frequency transaction pipelines, our engineering standards adhere to strict correctness, observability, and modularity.",
      icon: "Code",
      order: 1,
      businessProblems: JSON.stringify([
        "Legacy system bottlenecks stifling product velocity",
        "Fragile data synchronization and multi-tenant scaling challenges",
        "Lack of observability and cascading failures across microservices",
        "Inefficient developer workflows and slow release cycles"
      ]),
      solutions: JSON.stringify([
        "Domain-Driven Design (DDD) & clean modular architectures",
        "High-performance RESTful & gRPC distributed microservices",
        "Event-driven messaging architectures using Kafka & RabbitMQ",
        "Legacy code modernization with zero-downtime migration strategies"
      ]),
      process: JSON.stringify([
        { step: "01", title: "Domain Discovery", desc: "Deconstruct business requirements into bounded contexts and entity models." },
        { step: "02", title: "System Architecture", desc: "Model data flows, latency targets, fault domains, and interface contracts." },
        { step: "03", title: "Core Implementation", desc: "Test-driven development with strict typing, static analysis, and automated CI pipelines." },
        { step: "04", title: "Verification & Benchmarking", desc: "Extensive load testing, chaos testing, and formal verification." },
        { step: "05", title: "Deployment & Observability", desc: "Continuous deployment with automated telemetry, distributed tracing, and health checks." }
      ]),
      technologies: JSON.stringify(["TypeScript", "Go", "Java", "Python", "Node.js", "PostgreSQL", "Kafka", "Docker", "Kubernetes"]),
      faqs: JSON.stringify([
        { q: "How do you handle migrations from monolithic architectures?", a: "We employ the Strangler Fig pattern, systematically decomposing services behind an API gateway while keeping the existing monolith fully operational until cutover." },
        { q: "What testing methodologies do you enforce?", a: "We implement rigorous unit test suites, integration tests against containerized databases, and end-to-end automated pipelines targeting over 85% branch coverage." }
      ])
    },
    {
      slug: "ai-ml",
      title: "AI & Machine Learning",
      tagline: "Production-Grade AI Agents and Cognitive Workflows",
      categorySlug: "artificial-intelligence",
      shortDesc: "Specialized LLM agent orchestration, Retrieval-Augmented Generation (RAG), computer vision, and predictive intelligence.",
      description: "We bridge cutting-edge AI research and dependable production software. We construct deterministic RAG pipelines, autonomous multi-agent systems, custom embedding search engines, and fine-tuned domain models with strict privacy and compliance guardrails.",
      icon: "Cpu",
      order: 2,
      businessProblems: JSON.stringify([
        "Unreliable LLM outputs, hallucinations, and lack of domain ground truth",
        "Data privacy concerns when leveraging proprietary enterprise data",
        "High inference latency and unmonitored API cost runaway",
        "Difficulty integrating machine learning models into live production applications"
      ]),
      solutions: JSON.stringify([
        "Deterministic Retrieval-Augmented Generation (RAG) with hybrid vector-lexical indexing",
        "Multi-agent autonomous systems with tool calling and human-in-the-loop controls",
        "Domain-specific fine-tuning and Quantized LLM deployment on self-hosted infrastructure",
        "Continuous eval pipelines measuring latency, accuracy, faithfulness, and cost"
      ]),
      process: JSON.stringify([
        { step: "01", title: "Data Audit & Feasibility", desc: "Assess data quality, tokenization characteristics, and task solvability." },
        { step: "02", title: "Pipeline Architecture", desc: "Design retrieval strategies, chunking semantics, and agentic workflows." },
        { step: "03", title: "Model Tuning & Eval", desc: "Benchmark against golden datasets, optimize prompt chains, and fine-tune weights." },
        { step: "04", title: "Production Hardening", desc: "Implement guardrails, rate limiters, fallback models, and caching layers." },
        { step: "05", title: "Continuous Monitoring", desc: "Live trace capture, hallucination detection, and real-time inference telemetry." }
      ]),
      technologies: JSON.stringify(["Python", "PyTorch", "Hugging Face", "LangChain", "LlamaIndex", "pgvector", "FastAPI", "TensorFlow", "Qdrant"]),
      faqs: JSON.stringify([
        { q: "Can we deploy AI models completely on-premise for data privacy?", a: "Yes. We engineer fully self-hosted inference pipelines using open-weights models (such as Llama 3, Mistral, and DeepSeek) running in isolated air-gapped environments." },
        { q: "How do you mitigate hallucinations in mission-critical applications?", a: "We utilize multi-stage verification: strict semantic groundings in RAG, citation cross-checking, JSON schema enforcement, and fallback rule validators." }
      ])
    },
    {
      slug: "web-development",
      title: "Web Development",
      tagline: "Editorial Craft Meets Ultra-High Performance",
      categorySlug: "digital-solutions",
      shortDesc: "Modern, dynamic web applications, bespoke digital flagships, and SaaS platforms engineered for world-class speed and accessibility.",
      description: "We design and engineer bespoke web experiences that merge experimental Swiss typography with blistering performance. Every web application we deliver achieves sub-second load times, flawless responsiveness, and robust security headers.",
      icon: "Globe",
      order: 3,
      businessProblems: JSON.stringify([
        "Bloated web experiences suffering from poor Core Web Vitals and low conversions",
        "Cluttered templates lacking distinctive brand character or technical authority",
        "Inaccessible interfaces failing compliance standards and mobile users",
        "Brittle frontends with high technical debt and poor SEO discoverability"
      ]),
      solutions: JSON.stringify([
        "Next.js App Router architectures with Server Components and edge caching",
        "Swiss modernist visual aesthetics with custom interactive fluid animations",
        "Rigorous WCAG 2.1 AA accessibility compliance and keyboard-first design",
        "Comprehensive SEO schemas, Open Graph generation, and Core Web Vitals optimization"
      ]),
      process: JSON.stringify([
        { step: "01", title: "Creative Ideation", desc: "Establish distinctive typography, grid proportions, and visual tone." },
        { step: "02", title: "Component Architecture", desc: "Construct modular, typed UI primitives adhering to strict design tokens." },
        { step: "03", title: "Full-Stack Assembly", desc: "Connect server-side data fetching, mutations, and optimistic UI updates." },
        { step: "04", title: "Performance Tuning", desc: "Bundle trimming, image optimization, font preloading, and caching strategy." },
        { step: "05", title: "Production Verification", desc: "Cross-device testing, automated accessibility audits, and security scan." }
      ]),
      technologies: JSON.stringify(["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "PostgreSQL", "Vercel / Cloud"]),
      faqs: JSON.stringify([
        { q: "What performance benchmarks do you target?", a: "We architect every web application to target 95+ Lighthouse scores across Performance, Accessibility, Best Practices, and SEO." },
        { q: "Can we manage content without technical assistance?", a: "Yes. We build custom intuitive administration dashboards allowing real-time content updates, asset management, and configuration controls." }
      ])
    },
    {
      slug: "mobile-development",
      title: "Mobile & Desktop",
      tagline: "Fluid Native and Cross-Platform Applications",
      categorySlug: "digital-solutions",
      shortDesc: "High-performance applications for iOS, Android, macOS, and Linux built for responsiveness, offline readiness, and seamless sync.",
      description: "We develop reliable mobile and desktop client applications that feel native on every operating system. We emphasize instantaneous startup, resilient offline-first data replication, secure biometric authentication, and battery efficiency.",
      icon: "Smartphone",
      order: 4,
      businessProblems: JSON.stringify([
        "Sluggish cross-platform apps that feel clunky compared to native experiences",
        "Data loss during intermittent mobile connectivity and network dropouts",
        "Security vulnerabilities in mobile token storage and local database caching",
        "Codebase divergence causing double maintenance overhead across platforms"
      ]),
      solutions: JSON.stringify([
        "React Native & Flutter native bridges delivering 60/120fps fluid interaction",
        "Offline-first sync architectures using SQLite/CRDTs with automatic conflict resolution",
        "Hardware-backed secure enclave integration for biometric login and cryptographic key storage",
        "Unified design systems shared across mobile, tablet, and desktop viewports"
      ]),
      process: JSON.stringify([
        { step: "01", title: "User Flow Mapping", desc: "Define navigation ergonomics, gesture patterns, and offline boundaries." },
        { step: "02", title: "Platform Architecture", desc: "Configure build targets, native bridges, and local persistence stores." },
        { step: "03", title: "Iterative Build", desc: "Implement core screens, background workers, and real-time socket connections." },
        { step: "04", title: "Device Matrix Testing", desc: "Test across real physical devices covering multiple OS versions and screen sizes." },
        { step: "05", title: "App Store Publishing", desc: "Handle certificate signing, store metadata, review submissions, and release pipelines." }
      ]),
      technologies: JSON.stringify(["React Native", "Flutter", "Swift", "Kotlin", "TypeScript", "Electron / Tauri", "SQLite"]),
      faqs: JSON.stringify([
        { q: "Should we build native or cross-platform?", a: "For 90% of business applications, modern React Native or Flutter provides identical performance with halved development timelines. We guide you honestly based on device hardware integration needs." }
      ])
    },
    {
      slug: "cybersecurity",
      title: "Cybersecurity",
      tagline: "Defensive Engineering and Authorized Security Auditing",
      categorySlug: "security-infra",
      shortDesc: "Authorized penetration testing (VAPT), vulnerability assessments, secure code auditing, and zero-trust security postures.",
      description: "Security is an architectural prerequisite, not an afterthought. We provide authorized vulnerability assessments, web application penetration testing (VAPT), cryptographic reviews, and DevSecOps pipelines ensuring your applications resist modern threat vectors.",
      icon: "ShieldCheck",
      order: 5,
      businessProblems: JSON.stringify([
        "Undiscovered vulnerabilities exposing sensitive customer data and IP",
        "Non-compliance with enterprise security mandates (SOC2, ISO 27001, GDPR)",
        "Insecure API endpoints vulnerable to broken object-level authorization (BOLA)",
        "Lack of security gating in automated CI/CD deployment pipelines"
      ]),
      solutions: JSON.stringify([
        "Authorized Vulnerability Assessment and Penetration Testing (VAPT)",
        "Static and Dynamic Application Security Testing (SAST/DAST) automation",
        "Zero-Trust network architecture and role-based least privilege enforcement",
        "Detailed remediation roadmaps with developer-ready code fixes and re-testing"
      ]),
      process: JSON.stringify([
        { step: "01", title: "Scope & Authorization", desc: "Define rules of engagement, target assets, and obtain formal legal authorizations." },
        { step: "02", title: "Threat Modeling", desc: "Map attack surfaces, authentication flows, and data egress channels." },
        { step: "03", title: "Active Assessment", desc: "Execute automated and manual testing against OWASP Top 10 vulnerabilities." },
        { step: "04", title: "Formal Reporting", desc: "Deliver categorized executive summaries, CVSS scores, and reproducible PoCs." },
        { step: "05", title: "Remediation & Sign-off", desc: "Assist engineering teams with fixes and perform verification re-testing." }
      ]),
      technologies: JSON.stringify(["Burp Suite", "OWASP ZAP", "SonarQube", "Trivy", "Semgrep", "Wireshark", "Linux", "OpenSSL"]),
      faqs: JSON.stringify([
        { q: "Do you perform unauthorized penetration testing?", a: "Strictly no. Axion Technologies operates purely under written defensive security mandates and formal client authorizations adhering to ethical disclosure protocols." },
        { q: "What deliverables do we receive following an assessment?", a: "You receive an executive summary for stakeholders, a detailed technical report with CVSS scoring, exact reproduction steps, and specific remediation code guides." }
      ])
    },
    {
      slug: "cloud",
      title: "Cloud & Infrastructure",
      tagline: "Resilient Cloud Architecture, DevOps & SRE",
      categorySlug: "security-infra",
      shortDesc: "Cloud architecture, Linux systems administration, Kubernetes containerization, CI/CD pipelines, and 24/7 reliability engineering.",
      description: "We architect scalable cloud environments that keep your services available under explosive traffic spikes. From automated multi-region failovers to declarative Infrastructure-as-Code, we build infrastructure that just works.",
      icon: "Cloud",
      order: 6,
      businessProblems: JSON.stringify([
        "Manual, error-prone server deployments prone to outages",
        "Runaway cloud infrastructure bills with underutilized compute instances",
        "Unreliable disaster recovery and absence of verified backup restorations",
        "Slow feedback loops between software developers and production environments"
      ]),
      solutions: JSON.stringify([
        "Infrastructure as Code (IaC) utilizing Terraform and Ansible",
        "Container orchestration with Kubernetes and Docker Swarm",
        "Zero-downtime blue/green and canary deployment CI/CD pipelines",
        "Automated backup strategies with point-in-time recovery and failover testing"
      ]),
      process: JSON.stringify([
        { step: "01", title: "Infrastructure Audit", desc: "Inspect current topology, network traffic, security groups, and monthly spend." },
        { step: "02", title: "Architecture Blueprint", desc: "Model high-availability VPCs, load balancers, and container clusters." },
        { step: "03", title: "IaC Implementation", desc: "Codify all resources using Terraform with immutable infrastructure principles." },
        { step: "04", title: "Pipeline Automation", desc: "Configure automated testing, container builds, and deployment workflows." },
        { step: "05", title: "SRE & Observability", desc: "Deploy Prometheus, Grafana, alerts, and automated autoscaling triggers." }
      ]),
      technologies: JSON.stringify(["AWS", "Google Cloud", "DigitalOcean", "Kubernetes", "Docker", "Terraform", "Nginx", "Linux", "Prometheus", "Grafana"]),
      faqs: JSON.stringify([
        { q: "Can you help optimize our monthly cloud spend?", a: "Yes. Our cloud efficiency audits regularly reduce monthly infrastructure expenditure by 30% to 50% through rightsizing, reserved capacity planning, and architectural optimization." }
      ])
    }
  ];

  for (const s of servicesData) {
    const categoryId = catMap.get(s.categorySlug)!;
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        tagline: s.tagline,
        shortDesc: s.shortDesc,
        description: s.description,
        icon: s.icon,
        order: s.order,
        businessProblems: s.businessProblems,
        solutions: s.solutions,
        process: s.process,
        technologies: s.technologies,
        faqs: s.faqs,
        categoryId,
      },
      create: {
        slug: s.slug,
        title: s.title,
        tagline: s.tagline,
        shortDesc: s.shortDesc,
        description: s.description,
        icon: s.icon,
        order: s.order,
        businessProblems: s.businessProblems,
        solutions: s.solutions,
        process: s.process,
        technologies: s.technologies,
        faqs: s.faqs,
        categoryId,
      },
    });
  }
  console.log("✓ Services populated");

  // 5. Project Categories & Projects (Case Studies)
  const projectCategories = [
    { name: "Enterprise Software", slug: "enterprise-software" },
    { name: "AI & Cognitive Systems", slug: "ai-systems" },
    { name: "Cybersecurity & Infrastructure", slug: "cybersecurity-infra" },
    { name: "Digital Platforms", slug: "digital-platforms" },
  ];

  const projCatMap = new Map<string, string>();
  for (const pcat of projectCategories) {
    const created = await prisma.projectCategory.upsert({
      where: { slug: pcat.slug },
      update: { name: pcat.name },
      create: pcat,
    });
    projCatMap.set(pcat.slug, created.id);
  }

  const projectsData = [
    {
      slug: "apex-financial-ledger",
      title: "Apex High-Throughput Autonomous Ledger",
      categorySlug: "enterprise-software",
      shortDesc: "Double-entry distributed transaction ledger capable of processing 120,000 operations per second with ACID guarantees.",
      description: "A demonstration enterprise project illustrating mission-critical financial transaction processing. Built with an event-sourced architecture, it features audit trails, real-time fraud scoring, and sub-millisecond reconciliation across distributed multi-region databases.",
      clientName: "Demonstration Case Study",
      coverImage: "/images/projects/ledger.svg",
      challenge: "Financial systems require absolute transactional consistency, zero data loss during network partitions, and real-time reconciliation at extreme throughput.",
      solution: "Engineered an append-only event-sourced ledger using PostgreSQL with write-ahead log replication, Kafka partitioning, and pessimistic locking on hot balance accounts.",
      process: JSON.stringify([
        { step: "01", title: "Consensus Modeling", desc: "Designed distributed state machines and partition tolerance strategies." },
        { step: "02", title: "Engine Implementation", desc: "Implemented core ledger primitives in Go with high-performance memory pooling." },
        { step: "03", title: "Chaos & Fuzz Testing", desc: "Executed simulated network partition tests and concurrent race condition audits." }
      ]),
      technologies: JSON.stringify(["Go", "PostgreSQL", "Kafka", "Docker", "gRPC", "Prometheus"]),
      results: "Benchmarked sustained throughput of 120,000 TPS with 99.999% consistency during simulated region disconnects.",
      projectDate: "2026",
      isFeatured: true,
      order: 1,
    },
    {
      slug: "sentio-cognitive-platform",
      title: "Sentio Enterprise AI Agent Orchestrator",
      categorySlug: "ai-systems",
      shortDesc: "Multi-agent autonomous framework combining deterministic RAG with dynamic tool execution for technical support.",
      description: "Demonstration AI system showcasing multi-step cognitive workflows. Integrates domain retrieval, dynamic function calling, token budget management, and human-in-the-loop validation for enterprise knowledge repositories.",
      clientName: "Demonstration Case Study",
      coverImage: "/images/projects/ai-orchestrator.svg",
      challenge: "Enterprises face hallucinations, stale context, and unconstrained token consumption when deploying general-purpose LLM interfaces.",
      solution: "Engineered a hybrid retrieval system using pgvector and BM25 lexical ranking, combined with stateful agent graphs that validate citations before responding.",
      process: JSON.stringify([
        { step: "01", title: "Embedding Optimization", desc: "Benchmarked domain embedding models across technical documentation sets." },
        { step: "02", title: "Graph Agent Architecture", desc: "Designed cyclic state machines for multi-turn task deconstruction." },
        { step: "03", title: "Evaluation Harness", desc: "Ran automated evals on 2,000 synthetic test cases to verify factual fidelity." }
      ]),
      technologies: JSON.stringify(["Python", "FastAPI", "pgvector", "LangGraph", "React", "TypeScript"]),
      results: "Reduced hallucination rate to < 0.4% across 50,000 benchmark queries while trimming token usage by 38%.",
      projectDate: "2026",
      isFeatured: true,
      order: 2,
    },
    {
      slug: "vanguard-zero-trust-gateway",
      title: "Vanguard Zero-Trust Security Gateway",
      categorySlug: "cybersecurity-infra",
      shortDesc: "Micro-segmented identity-aware reverse proxy with continuous cryptographic verification and adaptive anomaly detection.",
      description: "Demonstration cybersecurity architecture engineered to protect internal corporate APIs and microservices from unauthorized lateral movement. Features mutual TLS (mTLS), Ephemeral JWT issuance, and real-time behavioral anomaly scoring.",
      clientName: "Demonstration Case Study",
      coverImage: "/images/projects/security-gateway.svg",
      challenge: "Perimeter-based security models leave internal services vulnerable once an adversary compromises an internal endpoint.",
      solution: "Implemented an identity-aware proxy requiring hardware-token authentication, continuous posture assessment, and fine-grained cryptographic authorization at every request.",
      process: JSON.stringify([
        { step: "01", title: "Threat Surface Analysis", desc: "Audited standard microservice mesh traffic and identified credential caching risks." },
        { step: "02", title: "Proxy Implementation", desc: "Built lightweight Rust proxy modules with zero-copy stream inspection." },
        { step: "03", title: "Penetration Testing", desc: "Subjected the gateway to simulated credential injection and timing attacks." }
      ]),
      technologies: JSON.stringify(["Rust", "Linux", "OpenSSL", "WireGuard", "Nginx", "Docker"]),
      results: "Successfully blocked 100% of simulated credential replay attacks with an added latency overhead of only 1.2ms.",
      projectDate: "2026",
      isFeatured: true,
      order: 3,
    },
    {
      slug: "hyperion-cloud-orchestrator",
      title: "Hyperion Multi-Region Cloud Control Plane",
      categorySlug: "cybersecurity-infra",
      shortDesc: "Automated Kubernetes control plane orchestrating continuous deployments across hybrid cloud infrastructure.",
      description: "Demonstration cloud engineering project featuring automated cluster lifecycle management, intelligent auto-scaling based on incoming queue depth, and automated failover across geographic availability zones.",
      clientName: "Demonstration Case Study",
      coverImage: "/images/projects/cloud-control.svg",
      challenge: "Managing disparate cloud accounts and Kubernetes clusters creates operational friction and configuration drift.",
      solution: "Built a declarative GitOps engine utilizing Terraform and custom Kubernetes operators that enforce immutable configuration.",
      process: JSON.stringify([
        { step: "01", title: "GitOps Foundation", desc: "Established single source of truth repositories for infrastructure definitions." },
        { step: "02", title: "Operator Development", desc: "Wrote Kubernetes controllers in Go for automated cluster reconciliation." },
        { step: "03", title: "Disaster Recovery Testing", desc: "Conducted simulated regional blackouts with automated DNS routing." }
      ]),
      technologies: JSON.stringify(["Kubernetes", "Terraform", "Go", "Helm", "AWS", "Grafana"]),
      results: "Achieved automated disaster recovery cutover within 42 seconds with zero customer session invalidation.",
      projectDate: "2025",
      isFeatured: false,
      order: 4,
    }
  ];

  for (const p of projectsData) {
    const categoryId = projCatMap.get(p.categorySlug)!;
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        shortDesc: p.shortDesc,
        description: p.description,
        clientName: p.clientName,
        coverImage: p.coverImage,
        challenge: p.challenge,
        solution: p.solution,
        process: p.process,
        technologies: p.technologies,
        results: p.results,
        projectDate: p.projectDate,
        isFeatured: p.isFeatured,
        order: p.order,
        categoryId,
      },
      create: {
        slug: p.slug,
        title: p.title,
        shortDesc: p.shortDesc,
        description: p.description,
        clientName: p.clientName,
        coverImage: p.coverImage,
        challenge: p.challenge,
        solution: p.solution,
        process: p.process,
        technologies: p.technologies,
        results: p.results,
        projectDate: p.projectDate,
        isFeatured: p.isFeatured,
        order: p.order,
        categoryId,
      },
    });
  }
  console.log("✓ Projects seeded");

  // 6. Proprietary Software & AI Products
  const productsData = [
    {
      slug: "axion-copilot-engine",
      name: "Axion Copilot Engine",
      tagline: "Enterprise RAG & Autonomous Agent Framework",
      category: "AI & Automation",
      description: "A plug-and-play orchestration middleware connecting enterprise databases, vector indexes, and custom reasoning LLMs with deterministic safety guardrails.",
      status: "Active Development",
      coverImage: "/images/products/copilot.svg",
      features: [
        { title: "Hybrid Vector-Lexical Retrieval", description: "Combines dense embeddings with BM25 keyword scoring for high precision context assembly." },
        { title: "Deterministic Citation Guardrails", description: "Verifies every model token against source documents before generating final outputs." },
        { title: "Air-Gapped Self-Hosting", description: "Zero external cloud telemetry. Deployable on bare-metal GPU clusters." },
        { title: "Multi-Agent Protocol", description: "Supports hierarchical task delegation with human-in-the-loop review checkpoints." }
      ]
    },
    {
      slug: "shieldmatrix-vapt",
      name: "ShieldMatrix Security Inspector",
      tagline: "Automated Continuous Application Security & Vulnerability Analysis",
      category: "Cybersecurity Tooling",
      description: "Developer-first CLI and CI/CD security scanner that detects logic flaws, broken access controls (BOLA), and cryptographic misconfigurations before code lands in production.",
      status: "Beta Testing",
      coverImage: "/images/products/shield.svg",
      features: [
        { title: "API Logic Fuzzing", description: "Simulates adversarial HTTP payloads against OpenAPI and GraphQL schemas." },
        { title: "Automated BOLA Detection", description: "Verifies multi-tenant isolation by attempting unauthorized object access across roles." },
        { title: "Git-Native Reports", description: "Generates actionable pull request annotations with exact line-level remediations." }
      ]
    },
    {
      slug: "synapse-dataflow",
      name: "Synapse Dataflow",
      tagline: "Ultra-Low Latency Event Streaming Core",
      category: "Developer Utilities",
      description: "A lightweight, memory-efficient event streaming pipeline designed for distributed edge devices and high-concurrency microservices.",
      status: "Concept / Architecture",
      coverImage: "/images/products/dataflow.svg",
      features: [
        { title: "Zero-Copy Serialization", description: "Achieves microsecond dispatch times by avoiding memory allocations in hot paths." },
        { title: "Built-in Backpressure", description: "Adaptive flow control protecting downstream databases from burst overloads." }
      ]
    }
  ];

  for (const prod of productsData) {
    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        tagline: prod.tagline,
        category: prod.category,
        description: prod.description,
        status: prod.status,
        coverImage: prod.coverImage,
        isFeatured: true,
      },
      create: {
        slug: prod.slug,
        name: prod.name,
        tagline: prod.tagline,
        category: prod.category,
        description: prod.description,
        status: prod.status,
        coverImage: prod.coverImage,
        isFeatured: true,
      },
    });

    // Clear and re-add features
    await prisma.productFeature.deleteMany({ where: { productId: createdProd.id } });
    for (let i = 0; i < prod.features.length; i++) {
      await prisma.productFeature.create({
        data: {
          productId: createdProd.id,
          title: prod.features[i].title,
          description: prod.features[i].description,
          order: i + 1,
        },
      });
    }
  }
  console.log("✓ Products and features seeded");

  // 7. Blog Categories & Technical Articles (Insights)
  const blogCategories = [
    { name: "Artificial Intelligence", slug: "ai-engineering" },
    { name: "Systems Architecture", slug: "systems-architecture" },
    { name: "Cybersecurity", slug: "cybersecurity-research" },
  ];

  const blogCatMap = new Map<string, string>();
  for (const bcat of blogCategories) {
    const created = await prisma.blogCategory.upsert({
      where: { slug: bcat.slug },
      update: { name: bcat.name },
      create: bcat,
    });
    blogCatMap.set(bcat.slug, created.id);
  }

  const blogPosts = [
    {
      slug: "deterministic-rag-pipelines",
      title: "Building Deterministic RAG Pipelines for High-Compliance Environments",
      categorySlug: "ai-engineering",
      excerpt: "Why simple vector similarity search fails in enterprise contexts, and how hybrid indexing with attribution auditing solves hallucination.",
      content: `### The Limits of Naive Vector Search

Retrieval-Augmented Generation (RAG) is frequently pitched as a solved architecture: chunk documents, generate embeddings with a standard model, store them in a vector database, and perform cosine similarity search. 

However, in high-compliance sectors like legal, aerospace, and banking, this naive pipeline produces subtle but catastrophic failures:
1. **Loss of structural hierarchy**: Documents like financial disclosures rely heavily on table relationships and sequential clauses that get shredded by standard 500-token chunkers.
2. **Lexical blindness**: When a user queries for a specific invoice number or product SKU, embedding models frequently retrieve semantically related pages while completely missing the exact alphanumeric identifier.

### Hybrid Retrieval: The Dual-Index Approach

At Axion Technologies, we deploy a hybrid retrieval architecture combining dense vectors with sparse lexical indices (BM25 or Lucene inverted indices). 

By cross-ranking candidates using Reciprocal Rank Fusion (RRF), we balance conceptual relevance with exact keyword matching.

\`\`\`typescript
// Conceptual Reciprocal Rank Fusion
function reciprocalRankFusion(
  vectorResults: Document[],
  lexicalResults: Document[],
  k = 60
): Map<string, number> {
  const scores = new Map<string, number>();
  
  vectorResults.forEach((doc, rank) => {
    scores.set(doc.id, (scores.get(doc.id) || 0) + 1 / (k + rank + 1));
  });

  lexicalResults.forEach((doc, rank) => {
    scores.set(doc.id, (scores.get(doc.id) || 0) + 1 / (k + rank + 1));
  });

  return scores;
}
\`\`\`

### Citation Verification as an Architectural Barrier

Before sending context to the generator model, our pipeline runs a verification pass. Each retrieved chunk must pass a relevancy scoring filter. Furthermore, the model is instructed to output JSON with explicit citation IDs mapped to exact character offsets.

If any assertion fails validation, the system falls back to a deterministic safe message rather than fabricating answers.`,
      coverImage: "/images/blog/rag.svg",
      readTime: "7 min read",
      authorName: "Axion AI Research Group",
      authorRole: "Cognitive Systems Architecture",
      tags: JSON.stringify(["AI", "RAG", "LLMs", "Vector Search", "Python"]),
      isFeatured: true,
    },
    {
      slug: "zero-trust-cloud-playbook",
      title: "The Zero-Trust Architecture Playbook for Modern Cloud Infrastructure",
      categorySlug: "cybersecurity-research",
      excerpt: "Deconstructing the myth of the secure perimeter: mutual TLS, ephemeral credentials, and least-privilege service meshes in practice.",
      content: `### The Demise of the Perimeter

Traditional enterprise networks operated on the castle-and-moat principle: once inside the VPN or corporate firewall, traffic was largely uninspected. In modern distributed cloud topologies, this assumption is dangerous. A single compromised container or stale API key grants attackers lateral traversal across your entire internal infrastructure.

### The Three Tenets of Zero-Trust

1. **Verify explicitly**: Always authenticate and authorize based on all available data points (identity, device posture, location, data classification).
2. **Use least-privilege access**: Restrict user and service access with Just-In-Time (JIT) and Just-Enough-Access (JEA) credentials.
3. **Assume breach**: Minimize blast radius by segmenting access by network, user, devices, and application awareness. Encrypt all sessions end-to-end.

### Implementing Mutual TLS (mTLS) Everywhere

Every internal RPC between services must verify both the client and server identity using short-lived X.509 certificates. By rotating certificates automatically via a trusted SPIFFE/SPIRE authority, static credentials are eliminated from source code and environment variables entirely.`,
      coverImage: "/images/blog/zero-trust.svg",
      readTime: "9 min read",
      authorName: "Axion Security Team",
      authorRole: "Application Security & VAPT",
      tags: JSON.stringify(["Cybersecurity", "Zero-Trust", "DevSecOps", "Cloud"]),
      isFeatured: true,
    },
    {
      slug: "micro-frontends-nextjs",
      title: "Engineering Resilient Micro-Frontends with Next.js and Distributed Caching",
      categorySlug: "systems-architecture",
      excerpt: "How we architect large-scale multi-tenant web applications without sacrificing performance, bundle isolation, or developer autonomy.",
      content: `### The Micro-Frontend Dilemma

When organizations grow past dozens of engineering squads, monolithic frontends become release bottlenecks. Yet naive micro-frontend solutions frequently introduce terrible user experiences: 10MB JavaScript bundles, duplicated React runtimes, and janky layout shifts.

### Module Federation vs. App Router Multi-Zones

Next.js Multi-Zones provide an elegant alternative to runtime script injection. By mapping distinct sub-paths to independently deployed Next.js applications behind a reverse proxy, each squad retains total ownership of its repository, CI/CD pipeline, and dependencies while users experience a single seamless website.`,
      coverImage: "/images/blog/micro-frontend.svg",
      readTime: "6 min read",
      authorName: "Axion Web Architecture",
      authorRole: "Frontend Systems Engineering",
      tags: JSON.stringify(["Next.js", "Architecture", "TypeScript", "Performance"]),
      isFeatured: false,
    }
  ];

  for (const post of blogPosts) {
    const categoryId = blogCatMap.get(post.categorySlug)!;
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        readTime: post.readTime,
        authorName: post.authorName,
        authorRole: post.authorRole,
        tags: post.tags,
        isFeatured: post.isFeatured,
        categoryId,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        readTime: post.readTime,
        authorName: post.authorName,
        authorRole: post.authorRole,
        tags: post.tags,
        isFeatured: post.isFeatured,
        categoryId,
      },
    });
  }
  console.log("✓ Technical articles (Insights) seeded");

  console.log("✨ Axion Technologies database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

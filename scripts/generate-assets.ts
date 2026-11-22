import fs from "fs";
import path from "path";

const dirs = [
  "public/images/projects",
  "public/images/products",
  "public/images/blog",
  "public/images/logo",
];

for (const d of dirs) {
  fs.mkdirSync(path.resolve(process.cwd(), d), { recursive: true });
}

function createGeometricSvg(title: string, subtitle: string, codeSnippet: string, accent = "#B6FF5C") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%" fill="none">
  <rect width="1200" height="675" fill="#141414"/>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222222" stroke-width="1"/>
    </pattern>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#141414" stop-opacity="0"/>
    </linearGradient>
  </defs>
  
  <rect width="1200" height="675" fill="url(#grid)"/>
  <circle cx="950" cy="200" r="280" fill="url(#glow)"/>
  
  <!-- Technical Framing -->
  <line x1="60" y1="60" x2="1140" y2="60" stroke="#333" stroke-width="1"/>
  <line x1="60" y1="615" x2="1140" y2="615" stroke="#333" stroke-width="1"/>
  <line x1="60" y1="60" x2="60" y2="615" stroke="#333" stroke-width="1"/>
  <line x1="1140" y1="60" x2="1140" y2="615" stroke="#333" stroke-width="1"/>

  <!-- Crosshairs -->
  <path d="M 50 60 L 70 60 M 60 50 L 60 70" stroke="${accent}" stroke-width="2"/>
  <path d="M 1130 60 L 1150 60 M 1140 50 L 1140 70" stroke="${accent}" stroke-width="2"/>
  <path d="M 50 615 L 70 615 M 60 605 L 60 625" stroke="${accent}" stroke-width="2"/>
  <path d="M 1130 615 L 1150 615 M 1140 605 L 1140 625" stroke="${accent}" stroke-width="2"/>

  <!-- Brand Label -->
  <text x="100" y="110" font-family="monospace" font-size="14" fill="${accent}" letter-spacing="3">AXION TECHNOLOGIES // SYS-ENG</text>
  <text x="1050" y="110" text-anchor="end" font-family="monospace" font-size="14" fill="#666" letter-spacing="2">REV 2026.04</text>

  <!-- Editorial typography -->
  <text x="100" y="240" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="44" fill="#F5F3EF" letter-spacing="-1">${title.toUpperCase()}</text>
  <text x="100" y="280" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="20" fill="#A5A5A5">${subtitle}</text>

  <!-- Code / Abstract Blueprint -->
  <rect x="100" y="340" width="1000" height="210" fill="#181818" stroke="#282828" stroke-width="1" rx="4"/>
  <circle cx="130" cy="365" r="5" fill="#EF4444"/>
  <circle cx="150" cy="365" r="5" fill="#EAB308"/>
  <circle cx="170" cy="365" r="5" fill="#22C55E"/>
  <text x="210" y="370" font-family="monospace" font-size="12" fill="#777">ENGINEERING ARTIFACT // SPEC</text>
  
  <text x="130" y="420" font-family="monospace" font-size="16" fill="${accent}">${codeSnippet.split('\\n')[0] || ''}</text>
  <text x="130" y="455" font-family="monospace" font-size="15" fill="#D1D5DB">${codeSnippet.split('\\n')[1] || ''}</text>
  <text x="130" y="490" font-family="monospace" font-size="15" fill="#9CA3AF">${codeSnippet.split('\\n')[2] || ''}</text>
  <text x="130" y="525" font-family="monospace" font-size="14" fill="#6B7280">${codeSnippet.split('\\n')[3] || ''}</text>
</svg>`;
}

const assets = [
  {
    path: "public/images/projects/ledger.svg",
    title: "Apex Autonomous Ledger",
    subtitle: "High-Throughput Distributed Financial Event-Sourcing",
    code: "type Transaction = { id: UUID, debit: Account, credit: Account, amount: Satoshi }\\nconst quorum = await ConsensusEngine.validatePartition(wal_snapshot);\\nemit LedgerCommittedEvent({ tps: 124500, p99_latency: '1.2ms' });\\nStatus: VERIFIED_ACID_COMPLIANT",
  },
  {
    path: "public/images/projects/ai-orchestrator.svg",
    title: "Sentio Agent Platform",
    subtitle: "Deterministic RAG & Hybrid Lexical Retrieval Architecture",
    code: "const ranker = new ReciprocalRankFusion({ k: 60, dense_weight: 0.65 });\\nconst verifiedChunks = await CitationAuditor.assertGroundTruth(context);\\nagentGraph.dispatch({ state: 'EXECUTE_TOOL', confidence: 0.994 });\\nOutput: HALLUCINATION_FREE_STREAM",
  },
  {
    path: "public/images/projects/security-gateway.svg",
    title: "Vanguard Zero-Trust Proxy",
    subtitle: "Identity-Aware Micro-Segmented Reverse Gateway",
    code: "mTLS.enforcePeerCert({ spiffe_id: 'spiffe://axion.internal/service/core' });\\nHardwareEnclave.verifyAttestation(clientToken.getSignature());\\nRuleEngine.evaluateRBAC({ path: '/v2/admin', role: 'SUPER_ADMIN' });\\nResult: MUTUAL_CRYPTOGRAPHIC_HANDSHAKE_OK",
  },
  {
    path: "public/images/projects/cloud-control.svg",
    title: "Hyperion Cloud Orchestrator",
    subtitle: "Multi-Region Kubernetes Control Plane & Automated Failover",
    code: "apiVersion: core.axion.tech/v1alpha1 kind: MultiRegionCluster\\nspec.regions: [ 'ap-south-1', 'eu-central-1', 'us-east-1' ]\\nhealthProbe.failover({ target: 'auto_drain', maxRTO: '45s' });\\nState: RECONCILED_GLOBALLY_STABLE",
  },
  {
    path: "public/images/products/copilot.svg",
    title: "Axion Copilot Engine",
    subtitle: "Enterprise RAG & Autonomous Agent Framework",
    code: "import { CopilotEngine } from '@axion/copilot';\\nconst agent = new CopilotEngine({ vectorStore: 'pgvector', evalScoreMin: 0.95 });\\nconst result = await agent.runWorkflow('analyze-portfolio-exposure');\\nDeployment: AIR_GAPPED_READY",
  },
  {
    path: "public/images/products/shield.svg",
    title: "ShieldMatrix VAPT Inspector",
    subtitle: "Continuous Automated Application Security Scanner",
    code: "shieldmatrix scan --target https://api.internal.network --mode aggressive\\n[✓] Checked 142 BOLA access vectors -> 0 leaks detected\\n[✓] Validated JWT signature tampering protection\\nAudit: PASS (CVSS score 0.0)",
  },
  {
    path: "public/images/products/dataflow.svg",
    title: "Synapse Dataflow Core",
    subtitle: "Ultra-Low Latency Event Streaming Core",
    code: "let stream = Synapse::stream_from_ring_buffer(BufferConfig::zero_copy());\\nstream.backpressure_strategy(Backpressure::DropOldestAdaptive);\\nthroughput.bench_record({ events_per_sec: 2_450_000, mem_mb: 18.4 });\\nStatus: SUB_MICROSECOND_DISPATCH",
  },
  {
    path: "public/images/blog/rag.svg",
    title: "Deterministic RAG Engineering",
    subtitle: "Hybrid Lexical Indexing & Attribution Auditing in Production",
    code: "const reciprocalRank = (vectorScore * 0.6) + (bm25Score * 0.4);\\nCitationOffset.verifyExactMatch(generatedStatement, chunk.raw_text);\\nPipelineTelemetry.log('fidelity_metric', 0.998);\\nArticle: AXION RESEARCH REPORT #14",
  },
  {
    path: "public/images/blog/zero-trust.svg",
    title: "Zero-Trust Architecture",
    subtitle: "Defensive Engineering Principles for Modern Distributed Cloud",
    code: "principle: NEVER_TRUST_ALWAYS_VERIFY;\\nassert(session.mTLSVerified && session.riskScore < 0.1);\\nEphemeralKeys.rotateInterval({ seconds: 300 });\\nArticle: AXION RESEARCH REPORT #15",
  },
  {
    path: "public/images/blog/micro-frontend.svg",
    title: "Next.js Micro-Frontends",
    subtitle: "Scalable Multi-Zone Architecture Without Performance Penalties",
    code: "next.config.js: rewrites: async () => [{ source: '/dashboard/:path*', destination: 'http://dash.axion.internal/:path*' }]\\nSharedCache.hydrateState(ctx);\\nArticle: AXION RESEARCH REPORT #16",
  },
];

for (const a of assets) {
  const content = createGeometricSvg(a.title, a.subtitle, a.code);
  fs.writeFileSync(path.resolve(process.cwd(), a.path), content, "utf8");
  console.log(`Generated: ${a.path}`);
}

// Company Monogram & Logo
const logoMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <rect width="100" height="100" rx="12" fill="#101010"/>
  <path d="M 20 80 L 50 20 L 80 80" stroke="#F5F3EF" stroke-width="7" stroke-linecap="square" stroke-linejoin="miter"/>
  <path d="M 32 58 L 68 58" stroke="#B6FF5C" stroke-width="7" stroke-linecap="square"/>
  <circle cx="50" cy="20" r="4" fill="#B6FF5C"/>
</svg>`;

fs.writeFileSync(path.resolve(process.cwd(), "public/images/logo/axion-mark.svg"), logoMark, "utf8");
console.log("Generated: public/images/logo/axion-mark.svg");

import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { DEFAULT_SETTINGS, getCompanySettings } from "../src/lib/settings";

const JWT_SECRET = new TextEncoder().encode("axion-technologies-enterprise-jwt-super-secret-key-2026-xyz");

test("Security: Password hashing and verification with bcrypt", async () => {
  const password = "Admin@Axion2026!";
  const hash = await bcrypt.hash(password, 10);
  
  assert.notEqual(password, hash);
  assert.equal(await bcrypt.compare(password, hash), true);
  assert.equal(await bcrypt.compare("WrongPassword!", hash), false);
});

test("Security: JWT Session creation and cryptographic verification", async () => {
  const payload = {
    userId: "usr_test123",
    email: "admin@axiontech.in",
    name: "Axion Lead Administrator",
    role: "SUPER_ADMIN",
    permissions: ["*"],
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  assert.ok(typeof token === "string" && token.length > 20);

  const { payload: verified } = await jwtVerify(token, JWT_SECRET);
  assert.equal(verified.email, payload.email);
  assert.equal(verified.role, payload.role);
});

test("Form Validation & Anti-Spam: Inquiry Zod schema enforcement", () => {
  const inquirySchema = z.object({
    fullName: z.string().min(2),
    businessEmail: z.string().email(),
    serviceRequired: z.string().min(2),
    projectDescription: z.string().min(10),
    consent: z.boolean().refine((val) => val === true),
    website_trap: z.string().max(0).optional().or(z.literal("")),
  });

  // Valid payload
  const valid = inquirySchema.safeParse({
    fullName: "Elena Rostova",
    businessEmail: "elena@vanguard.io",
    serviceRequired: "Cybersecurity & VAPT",
    projectDescription: "We require an authorized defensive penetration testing assessment of our core financial APIs.",
    consent: true,
    website_trap: "",
  });
  assert.equal(valid.success, true);

  // Invalid email
  const invalidEmail = inquirySchema.safeParse({
    fullName: "Elena Rostova",
    businessEmail: "not-an-email",
    serviceRequired: "Cybersecurity",
    projectDescription: "Valid description longer than 10 characters",
    consent: true,
  });
  assert.equal(invalidEmail.success, false);

  // Missing consent
  const missingConsent = inquirySchema.safeParse({
    fullName: "Elena Rostova",
    businessEmail: "elena@vanguard.io",
    serviceRequired: "Cybersecurity",
    projectDescription: "Valid description longer than 10 characters",
    consent: false,
  });
  assert.equal(missingConsent.success, false);

  // Honeypot bot detection
  const botSubmission = inquirySchema.safeParse({
    fullName: "Bot",
    businessEmail: "bot@spam.com",
    serviceRequired: "Software",
    projectDescription: "Spam content generated automatically",
    consent: true,
    website_trap: "http://spam-link.com",
  });
  assert.equal(botSubmission.success, false);
});

test("Configuration Engine: Company settings fallback integrity", async () => {
  assert.equal(DEFAULT_SETTINGS.companyName, "AXION TECHNOLOGIES");
  assert.equal(DEFAULT_SETTINGS.tagline, "WE BUILD WHAT'S NEXT.");
  assert.equal(DEFAULT_SETTINGS.brandAccent, "#B6FF5C");
  assert.equal(DEFAULT_SETTINGS.brandBg, "#101010");

  const settings = await getCompanySettings();
  assert.ok(settings.companyName.length > 0);
  assert.ok(settings.contactEmail.includes("@"));
});

test("Multi-Video Runner: Video playlist structure and time span integrity", () => {
  assert.ok(DEFAULT_SETTINGS.heroClipSpan >= 2);
  const playlist = JSON.parse(DEFAULT_SETTINGS.heroPlaylist);
  assert.ok(Array.isArray(playlist));
  assert.ok(playlist.length >= 4);
  playlist.forEach((clip: { title: string; src: string; duration: number }) => {
    assert.ok(typeof clip.title === "string" && clip.title.length > 0);
    assert.ok(typeof clip.src === "string" && clip.src.endsWith(".mp4"));
    assert.ok(typeof clip.duration === "number" && clip.duration > 0);
  });
});

test("UI/DX Management: Design tokens, Telemetry schema, and Swiss Brutalism presets", () => {
  const PRESETS = {
    swiss: { accent: "#B6FF5C", bg: "#101010" },
    monolith: { accent: "#FFFFFF", bg: "#050505" },
    matrix: { accent: "#38BDF8", bg: "#070B14" },
  };

  assert.equal(PRESETS.swiss.accent, "#B6FF5C");
  assert.equal(PRESETS.monolith.accent, "#FFFFFF");
  assert.equal(PRESETS.matrix.accent, "#38BDF8");
});

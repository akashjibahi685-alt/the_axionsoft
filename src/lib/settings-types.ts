export interface VideoClipConfig {
  title: string;
  src: string;
  duration: number;
}

export interface CompanySettingsData {
  companyName: string;
  tagline: string;
  mission: string;
  vision: string;
  contactEmail: string;
  contactPhone: string;
  officeLocation: string;
  socialGithub: string;
  socialLinkedin: string;
  socialX: string;
  brandAccent: string;
  brandBg: string;
  heroVideoUrl: string;
  heroClipSpan: number;
  heroPlaylist: string;
}

export const DEFAULT_SETTINGS: CompanySettingsData = {
  companyName: "AXION TECHNOLOGIES",
  tagline: "WE BUILD WHAT'S NEXT.",
  mission: "Transform complex ideas into useful, intelligent, scalable and secure digital products.",
  vision: "Become a trusted technology partner for businesses, startups and organizations by delivering innovative software, AI solutions and secure digital infrastructure.",
  contactEmail: "contact@axiontech.in",
  contactPhone: "+91 (80) 4920-8000",
  officeLocation: "Bengaluru, Karnataka, India",
  socialGithub: "https://github.com/axion-technologies",
  socialLinkedin: "https://linkedin.com/company/axion-technologies",
  socialX: "https://x.com/axiontech_in",
  brandAccent: "#B6FF5C",
  brandBg: "#101010",
  heroVideoUrl: "/videos/hero.mp4",
  heroClipSpan: 6,
  heroPlaylist: JSON.stringify([
    { title: "HARDWARE // SWITCH LOGIC", src: "/videos/clip1-hardware.mp4", duration: 6 },
    { title: "NEURAL // TENSOR GRAPH", src: "/videos/clip2-neural.mp4", duration: 6 },
    { title: "MAINFRAME // CLOUD CLUSTER", src: "/videos/clip3-server.mp4", duration: 6 },
    { title: "DISTRIBUTED // PIPELINE", src: "/videos/clip4-code.mp4", duration: 6 },
    { title: "TELEMETRY // RUNTIME CORE", src: "/videos/hero.mp4", duration: 6 },
  ]),
};

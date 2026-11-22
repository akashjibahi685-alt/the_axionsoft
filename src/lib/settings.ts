import { prisma } from "./prisma";
import { CompanySettingsData, DEFAULT_SETTINGS } from "./settings-types";

export * from "./settings-types";

export async function getCompanySettings(): Promise<CompanySettingsData> {
  try {
    const records = await prisma.companySetting.findMany();
    const map = new Map<string, string>();
    records.forEach((r) => map.set(r.key, r.value));

    return {
      companyName: map.get("company_name") || DEFAULT_SETTINGS.companyName,
      tagline: map.get("company_tagline") || DEFAULT_SETTINGS.tagline,
      mission: map.get("company_mission") || DEFAULT_SETTINGS.mission,
      vision: map.get("company_vision") || DEFAULT_SETTINGS.vision,
      contactEmail: map.get("contact_email") || DEFAULT_SETTINGS.contactEmail,
      contactPhone: map.get("contact_phone") || DEFAULT_SETTINGS.contactPhone,
      officeLocation: map.get("office_location") || DEFAULT_SETTINGS.officeLocation,
      socialGithub: map.get("social_github") || DEFAULT_SETTINGS.socialGithub,
      socialLinkedin: map.get("social_linkedin") || DEFAULT_SETTINGS.socialLinkedin,
      socialX: map.get("social_x") || DEFAULT_SETTINGS.socialX,
      brandAccent: map.get("brand_accent") || DEFAULT_SETTINGS.brandAccent,
      brandBg: map.get("brand_background") || DEFAULT_SETTINGS.brandBg,
      heroVideoUrl: map.get("hero_video_url") || DEFAULT_SETTINGS.heroVideoUrl,
      heroClipSpan: map.get("hero_clip_span") ? parseInt(map.get("hero_clip_span")!, 10) : DEFAULT_SETTINGS.heroClipSpan,
      heroPlaylist: map.get("hero_playlist") || DEFAULT_SETTINGS.heroPlaylist,
    };
  } catch (error) {
    console.warn("Failed to fetch settings from DB, using defaults:", error);
    return DEFAULT_SETTINGS;
  }
}

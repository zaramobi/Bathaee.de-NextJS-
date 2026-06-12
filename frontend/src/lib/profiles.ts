import fs from "fs";
import path from "path";
import type { Profile, ProfileMeta } from "@/types/profile";

interface ProfilesJson {
  contact_email: string;
  profiles: Profile[];
}

function readProfilesJson(): ProfilesJson {
  const filePath =
    process.env.PROFILES_JSON_PATH ??
    path.join(process.cwd(), "..", "data", "profiles.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ProfilesJson;
}

export function getProfiles(): ProfileMeta[] {
  const { profiles } = readProfilesJson();
  return profiles.map((p) => ({
    id:        p.id,
    name:      p.personal.name,
    title:     p.personal.title,
    tagline:   p.personal.tagline,
    location:  p.personal.location,
    avatarUrl: p.personal.avatarUrl,
    summary:   p.summary,
    topSkills: Object.values(p.skills).flat().slice(0, 5),
  }));
}

export function getProfile(id: string): Profile {
  const { profiles } = readProfilesJson();
  const profile = profiles.find((p) => p.id === id);
  if (!profile) throw new Error(`Profile not found: ${id}`);
  return profile;
}

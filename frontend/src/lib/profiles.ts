import fs from "fs";
import path from "path";
import type { Profile, ProfileMeta } from "@/types/profile";

interface ProfilesJson {
  contact_email: string;
  profiles: Profile[];
}

function findProfilesJson(): string {
  if (process.env.PROFILES_JSON_PATH) return process.env.PROFILES_JSON_PATH;
  // Search up from cwd so this works regardless of where the server is launched from
  // (next dev runs from frontend/, standalone may run from frontend/.next/standalone/)
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "data", "profiles.json"),
    path.join(cwd, "..", "data", "profiles.json"),
    path.join(cwd, "..", "..", "data", "profiles.json"),
    path.join(cwd, "..", "..", "..", "data", "profiles.json"),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? candidates[1];
}

function readProfilesJson(): ProfilesJson {
  const raw = fs.readFileSync(findProfilesJson(), "utf-8");
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

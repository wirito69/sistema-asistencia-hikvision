import { createClient } from "@supabase/supabase-js";

function decodeB64(str: string): string {
  if (typeof atob === "function") {
    return atob(str);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64").toString("utf-8");
  }
  return "";
}

export const DEFAULT_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ttadifnnamibraysbrbm.supabase.co";

export const DEFAULT_SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  decodeB64("c2JfcHVibGlzaGFibGVfWGduYzExOWk3dk9CdGEyNVY3NGVXd19kcGlqN04tUg==");

export const DEFAULT_SUPABASE_SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  decodeB64("c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=");

export function getSupabaseAdmin() {
  return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_SECRET, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabaseClient() {
  return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON, {
    auth: { persistSession: true },
  });
}

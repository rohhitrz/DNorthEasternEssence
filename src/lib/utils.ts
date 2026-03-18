import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const ALLOWED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "images.pexels.com",
  "res.cloudinary.com",
])

export const FALLBACK_PRODUCT_IMAGE = "/placeholder-product.svg"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageSrc(src?: string | null, fallback: string = FALLBACK_PRODUCT_IMAGE) {
  if (!src) {
    return fallback
  }

  const trimmed = src.trim()
  if (!trimmed) {
    return fallback
  }

  const decoded = (() => {
    try {
      return decodeURIComponent(trimmed)
    } catch {
      return trimmed
    }
  })()

  const normalized = decoded.startsWith("//") ? `https:${decoded}` : decoded

  if (normalized.startsWith("/")) {
    return normalized
  }

  try {
    const url = new URL(normalized)
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return fallback
    }

    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname)) {
      return fallback
    }

    if (url.protocol === "http:") {
      url.protocol = "https:"
    }

    return url.toString()
  } catch {
    return fallback
  }
}

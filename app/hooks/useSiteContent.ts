"use client";

import { useEffect, useState } from "react";
import { defaultSiteContent, type SiteContent } from "../../lib/siteContent";

let siteContentCache: SiteContent | null = null;
let siteContentRequest: Promise<SiteContent> | null = null;

async function loadSiteContent(): Promise<SiteContent> {
  if (siteContentCache) {
    return siteContentCache;
  }

  if (!siteContentRequest) {
    siteContentRequest = fetch("/api/site-content")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch site content");
        }
        return res.json() as Promise<SiteContent>;
      })
      .then((data) => {
        siteContentCache = data;
        return data;
      })
      .catch(() => defaultSiteContent)
      .finally(() => {
        siteContentRequest = null;
      });
  }

  return siteContentRequest;
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(siteContentCache ?? defaultSiteContent);

  useEffect(() => {
    let active = true;

    loadSiteContent()
      .then((data) => {
        if (active) setContent(data);
      })
      .catch(() => {
        // Keep defaults when request fails.
      });

    return () => {
      active = false;
    };
  }, []);

  return content;
}

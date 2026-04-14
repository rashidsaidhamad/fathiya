import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultSiteContent, type ContactSubmission, type SiteContent } from "./siteContent";

const dataDir = path.join(process.cwd(), "data");
const siteContentPath = path.join(dataDir, "site-content.json");
const contactSubmissionsPath = path.join(dataDir, "contact-submissions.json");

async function ensureDir() {
  await mkdir(dataDir, { recursive: true });
}

async function ensureFile(filePath: string, content: string) {
  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, content, "utf8");
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  await ensureDir();
  await ensureFile(siteContentPath, JSON.stringify(defaultSiteContent, null, 2));

  const raw = await readFile(siteContentPath, "utf8");
  try {
    const parsed = JSON.parse(raw) as SiteContent;
    return {
      ...defaultSiteContent,
      ...parsed,
      contactActions: {
        ...defaultSiteContent.contactActions,
        ...(parsed as Partial<SiteContent>).contactActions,
      },
      contactFormSettings: {
        ...defaultSiteContent.contactFormSettings,
        ...(parsed as Partial<SiteContent>).contactFormSettings,
      },
      homePage: {
        ...defaultSiteContent.homePage,
        ...(parsed as Partial<SiteContent>).homePage,
        companyLogoUrl:
          (parsed as Partial<SiteContent>).homePage?.companyLogoUrl ?? defaultSiteContent.homePage.companyLogoUrl,
        aboutChecklist: Array.isArray((parsed as Partial<SiteContent>).homePage?.aboutChecklist)
          ? (parsed as Partial<SiteContent>).homePage?.aboutChecklist ?? defaultSiteContent.homePage.aboutChecklist
          : defaultSiteContent.homePage.aboutChecklist,
      },
      videoSection: {
        ...defaultSiteContent.videoSection,
        ...(parsed as Partial<SiteContent>).videoSection,
      },
      properties: Array.isArray((parsed as Partial<SiteContent>).properties)
        ? ((parsed as Partial<SiteContent>).properties ?? defaultSiteContent.properties).map((item, index) => {
            const merged = {
              ...defaultSiteContent.properties[index % defaultSiteContent.properties.length],
              ...item,
            };
            const gallery = Array.isArray((item as Partial<typeof merged>).images)
              ? ((item as Partial<typeof merged>).images ?? []).filter((image) => typeof image === "string" && image.trim().length > 0)
              : [];
            return {
              ...merged,
              images: gallery.length > 0 ? gallery : [merged.image],
              otherMobilePhone: typeof merged.otherMobilePhone === "string" ? merged.otherMobilePhone : "",
            };
          })
        : defaultSiteContent.properties,
      companyTeam: Array.isArray((parsed as Partial<SiteContent>).companyTeam)
        ? ((parsed as Partial<SiteContent>).companyTeam ?? defaultSiteContent.companyTeam).map((item, index) => ({
            ...defaultSiteContent.companyTeam[index % defaultSiteContent.companyTeam.length],
            ...item,
          }))
        : defaultSiteContent.companyTeam,
      companyTestimonials: Array.isArray((parsed as Partial<SiteContent>).companyTestimonials)
        ? ((parsed as Partial<SiteContent>).companyTestimonials ?? defaultSiteContent.companyTestimonials).map((item, index) => ({
            ...defaultSiteContent.companyTestimonials[index % defaultSiteContent.companyTestimonials.length],
            ...item,
          }))
        : defaultSiteContent.companyTestimonials,
      blogSidebarItems: Array.isArray((parsed as Partial<SiteContent>).blogSidebarItems)
        ? ((parsed as Partial<SiteContent>).blogSidebarItems ?? defaultSiteContent.blogSidebarItems).map((item, index) => ({
            ...defaultSiteContent.blogSidebarItems[index % defaultSiteContent.blogSidebarItems.length],
            ...item,
          }))
        : defaultSiteContent.blogSidebarItems,
      testimonials: Array.isArray((parsed as Partial<SiteContent>).testimonials)
        ? (parsed as Partial<SiteContent>).testimonials ?? defaultSiteContent.testimonials
        : defaultSiteContent.testimonials,
      articles: Array.isArray((parsed as Partial<SiteContent>).articles)
        ? (parsed as Partial<SiteContent>).articles ?? defaultSiteContent.articles
        : defaultSiteContent.articles,
    };
  } catch {
    await writeFile(siteContentPath, JSON.stringify(defaultSiteContent, null, 2), "utf8");
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  await ensureDir();
  await writeFile(siteContentPath, JSON.stringify(content, null, 2), "utf8");
  return content;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  await ensureDir();
  await ensureFile(contactSubmissionsPath, JSON.stringify([], null, 2));

  const raw = await readFile(contactSubmissionsPath, "utf8");
  try {
    return JSON.parse(raw) as ContactSubmission[];
  } catch {
    await writeFile(contactSubmissionsPath, JSON.stringify([], null, 2), "utf8");
    return [];
  }
}

export async function addContactSubmission(entry: ContactSubmission): Promise<ContactSubmission> {
  const items = await getContactSubmissions();
  items.unshift(entry);
  await writeFile(contactSubmissionsPath, JSON.stringify(items, null, 2), "utf8");
  return entry;
}

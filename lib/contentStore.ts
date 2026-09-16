import { readJsonBlob, writeJsonBlob } from "./blobStore";
import siteContentSeed from "../data/site-content.json";
import { defaultSiteContent, type ContactSubmission, type SiteContent } from "./siteContent";

const STORE_NAME = "site-data";
const SITE_CONTENT_KEY = "site-content";
const CONTACT_SUBMISSIONS_KEY = "contact-submissions";

export async function getSiteContent(): Promise<SiteContent> {
  const parsed = (await readJsonBlob<SiteContent>(STORE_NAME, SITE_CONTENT_KEY)) ?? (siteContentSeed as SiteContent);

  try {
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
              agentFullName: typeof merged.agentFullName === "string" ? merged.agentFullName : "Archipelago Estates Agent",
              agentImage: typeof merged.agentImage === "string" ? merged.agentImage : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
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
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  await writeJsonBlob(STORE_NAME, SITE_CONTENT_KEY, content);
  return content;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const items = await readJsonBlob<ContactSubmission[]>(STORE_NAME, CONTACT_SUBMISSIONS_KEY);
  return items ?? [];
}

export async function addContactSubmission(entry: ContactSubmission): Promise<ContactSubmission> {
  const items = await getContactSubmissions();
  items.unshift(entry);
  await writeJsonBlob(STORE_NAME, CONTACT_SUBMISSIONS_KEY, items);
  return entry;
}

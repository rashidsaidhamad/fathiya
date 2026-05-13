"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ArticleItem, BlogSidebarItem, CompanyTeamMember, CompanyTestimonialItem, ContactSubmission, PropertyItem, SiteContent } from "../../lib/siteContent";
import { defaultSiteContent } from "../../lib/siteContent";
type AdminSection = "home" | "properties" | "company" | "blog" | "contact";

function JsonEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "grid", gap: "8px" }}>
      <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        style={{
          width: "100%",
          fontFamily: "monospace",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "12px",
          fontSize: "12px",
          resize: "vertical",
        }}
      />
    </label>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("home");
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [status, setStatus] = useState("");
  const [homeChecklistJson, setHomeChecklistJson] = useState("[]");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordStatusType, setPasswordStatusType] = useState<"idle" | "success" | "error">("idle");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<"resize" | "crop">("resize");
  const [imageCropRatio, setImageCropRatio] = useState<"square" | "landscape" | "portrait">("square");
  const [mediaPreview, setMediaPreview] = useState<{
    url: string;
    kind: "image" | "video";
    title: string;
  } | null>(null);
  const [pendingUploadFile, setPendingUploadFile] = useState<{
    file: File;
    callback: (file: File) => Promise<void>;
  } | null>(null);
  const [uploadDialogMode, setUploadDialogMode] = useState<"resize" | "crop">("resize");
  const [uploadDialogRatio, setUploadDialogRatio] = useState<"square" | "landscape" | "portrait">("square");
  const [cropImagePreview, setCropImagePreview] = useState<string>("");
  const [cropImageDimensions, setCropImageDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
  const [cropDragging, setCropDragging] = useState<{ start: { x: number; y: number }; initial: typeof cropBox } | null>(null);
  const [cropResizeHandle, setCropResizeHandle] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/site-content"), fetch("/api/contact-submissions")])
      .then(async ([contentRes, submissionsRes]) => {
        const site = (await contentRes.json()) as SiteContent;
        const leads = (await submissionsRes.json()) as ContactSubmission[];
        setContent(site);
        setSubmissions(leads);
        setHomeChecklistJson(JSON.stringify(site.homePage.aboutChecklist, null, 2));
      })
      .catch(() => {
        setStatus("Could not load admin data");
      });
  }, []);

  const leadStats = useMemo(() => {
    const home = submissions.filter((item) => item.source === "home").length;
    const contact = submissions.filter((item) => item.source === "contact").length;
    const company = submissions.filter((item) => item.source === "company").length;
    return { total: submissions.length, home, contact, company };
  }, [submissions]);

  const contactFormOptions = content.contactFormSettings?.hearAboutUsOptions ?? defaultSiteContent.contactFormSettings.hearAboutUsOptions;
  const companyLogoUrl = content.homePage.companyLogoUrl?.trim() || "/logo.webp";
  const heroPreviewUrl = content.homePage.heroBackgroundImage?.trim() ?? "";
  const heroPreviewBackground = heroPreviewUrl ? `url("${heroPreviewUrl.replace(/"/g, '\\"')}")` : "none";

  const hearAboutUsCounts = useMemo(() => {
    return contactFormOptions.map((option) => ({
      option,
      count: submissions.filter((item) => Array.isArray(item.hearAboutUs) && item.hearAboutUs.includes(option)).length,
    }));
  }, [submissions, contactFormOptions]);

  const sidebarItems: Array<{ key: AdminSection; label: string }> = [
    { key: "home", label: "Home" },
    { key: "properties", label: "Properties" },
    { key: "company", label: "Our Company" },
    { key: "blog", label: "Blog" },
    { key: "contact", label: "Contact Us" },
  ];

  async function uploadAsset(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "Upload failed");
    }

    const payload = (await response.json()) as { url: string };
    return payload.url;
  }

  async function prepareImageForUpload(file: File, mode: "resize" | "crop" = "resize", ratio: "square" | "landscape" | "portrait" = "square") {
    if (!file.type.startsWith("image/")) {
      return file;
    }

    const imageUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Could not read image"));
        element.src = imageUrl;
      });

      const sourceWidth = image.naturalWidth || image.width;
      const sourceHeight = image.naturalHeight || image.height;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context || sourceWidth === 0 || sourceHeight === 0) {
        return file;
      }

      if (mode === "crop") {
        const cropRatios = {
          square: 1,
          landscape: 16 / 9,
          portrait: 4 / 5,
        } as const;
        const cropRatio = cropRatios[ratio];
        const sourceAspect = sourceWidth / sourceHeight;

        let sourceCropWidth = sourceWidth;
        let sourceCropHeight = sourceHeight;

        if (sourceAspect > cropRatio) {
          sourceCropWidth = Math.floor(sourceHeight * cropRatio);
        } else {
          sourceCropHeight = Math.floor(sourceWidth / cropRatio);
        }

        const sourceX = Math.floor((sourceWidth - sourceCropWidth) / 2);
        const sourceY = Math.floor((sourceHeight - sourceCropHeight) / 2);
        const targetWidth = 1600;
        const targetHeight = Math.round(targetWidth / cropRatio);

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.drawImage(image, sourceX, sourceY, sourceCropWidth, sourceCropHeight, 0, 0, targetWidth, targetHeight);
      } else {
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
        canvas.width = Math.max(1, Math.round(sourceWidth * scale));
        canvas.height = Math.max(1, Math.round(sourceHeight * scale));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((nextBlob) => resolve(nextBlob), file.type || "image/jpeg", 0.92));
      if (!blob) {
        return file;
      }

      return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
        type: blob.type || "image/jpeg",
        lastModified: Date.now(),
      });
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  function showUploadDialog(file: File, callback: (preparedFile: File) => Promise<void>) {
    setPendingUploadFile({ file, callback });
    setUploadDialogMode("resize");
    setUploadDialogRatio("square");
  }

  async function confirmUploadDialog() {
    if (!pendingUploadFile) return;
    try {
      const preparedFile = await prepareImageForUpload(pendingUploadFile.file, uploadDialogMode, uploadDialogRatio);
      await pendingUploadFile.callback(preparedFile);
      setPendingUploadFile(null);
      setStatus("Image uploaded successfully!");
    } catch (error) {
      setStatus(`Upload error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  function closeUploadDialog() {
    setPendingUploadFile(null);
    setCropImagePreview("");
    setCropImageDimensions({ width: 0, height: 0 });
    setCropBox({ x: 0, y: 0, width: 0, height: 0 });
    setCropDragging(null);
    setCropResizeHandle(null);
  }

  function openMediaPreview(url: string, kind: "image" | "video", title: string) {
    if (!url.trim()) return;
    setMediaPreview({ url, kind, title });
  }

  function closeMediaPreview() {
    setMediaPreview(null);
  }

  function removeHomeHeroImage() {
    setContent((prev) => ({
      ...prev,
      homePage: {
        ...prev.homePage,
        heroBackgroundImage: "",
      },
    }));
  }

  function removeCompanyLogo() {
    setContent((prev) => ({
      ...prev,
      homePage: {
        ...prev.homePage,
        companyLogoUrl: "",
      },
    }));
  }

  function removeVideoBackgroundImage() {
    setContent((prev) => ({
      ...prev,
      videoSection: {
        ...prev.videoSection,
        backgroundImage: "",
      },
    }));
  }

  function removeVideoFile() {
    setContent((prev) => ({
      ...prev,
      videoSection: {
        ...prev.videoSection,
        videoUrl: "",
      },
    }));
  }

  async function handleHomeImageUpload(file: File | null) {
    if (!file) return;
    setStatus("Preparing image...");
    showUploadDialog(file, async (preparedFile) => {
      try {
        const url = await uploadAsset(preparedFile);
        setContent((prev) => ({
          ...prev,
          homePage: {
            ...prev.homePage,
            heroBackgroundImage: url,
          },
        }));
        setStatus("Hero image uploaded. Save all changes to publish.");
      } catch (error) {
        setStatus(`Upload error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    });
  }

  async function handleCompanyLogoUpload(file: File | null) {
    if (!file) return;
    setStatus("Preparing image...");
    showUploadDialog(file, async (preparedFile) => {
      try {
        const url = await uploadAsset(preparedFile);
        setContent((prev) => ({
          ...prev,
          homePage: {
            ...prev.homePage,
            companyLogoUrl: url,
          },
        }));
        setStatus("Company logo uploaded. Save all changes to publish.");
      } catch (error) {
        setStatus((error as Error).message || "Company logo upload failed");
      }
    });
  }

  async function handleVideoImageUpload(file: File | null) {
    if (!file) return;
    setStatus("Preparing image...");
    showUploadDialog(file, async (preparedFile) => {
      try {
        const url = await uploadAsset(preparedFile);
        setContent((prev) => ({
          ...prev,
          videoSection: {
            ...prev.videoSection,
            backgroundImage: url,
          },
        }));
        setStatus("Image uploaded. Save all changes to publish.");
      } catch (error) {
        setStatus((error as Error).message || "Image upload failed");
      }
    });
  }

  async function handleVideoUpload(file: File | null) {
    if (!file) return;
    setStatus("Uploading video...");
    try {
      const url = await uploadAsset(file);
      setContent((prev) => ({
        ...prev,
        videoSection: {
          ...prev.videoSection,
          videoUrl: url,
        },
      }));
      setStatus("Video uploaded. Save all changes to publish.");
    } catch (error) {
      setStatus((error as Error).message || "Video upload failed");
    }
  }

  async function handlePropertyMainImageUpload(index: number, file: File | null) {
    if (!file) return;
    setStatus("Preparing image...");
    showUploadDialog(file, async (preparedFile) => {
      try {
        const url = await uploadAsset(preparedFile);
        updateProperty(index, {
          image: url,
          images: [url, ...((content.properties[index].images ?? []).filter((item) => item !== url))],
        });
        setStatus("Property main image uploaded. Save all changes to publish.");
      } catch (error) {
        setStatus((error as Error).message || "Property image upload failed");
      }
    });
  }

  async function handlePropertyVideoUpload(index: number, file: File | null) {
    if (!file) return;
    setStatus("Uploading property video...");
    try {
      const url = await uploadAsset(file);
      updateProperty(index, { videoUrl: url });
      setStatus("Property video uploaded. Save all changes to publish.");
    } catch (error) {
      setStatus((error as Error).message || "Property video upload failed");
    }
  }

  async function handlePropertyGalleryUpload(index: number, files: FileList | null) {
    if (!files || files.length === 0) return;
    setStatus("Preparing images...");
    // For gallery with multiple files, show dialog for first file and use those settings for all
    const firstFile = Array.from(files)[0];
    showUploadDialog(firstFile, async (preparedFirstFile) => {
      try {
        // Prepare and upload all files with the same settings
        const mode = uploadDialogMode;
        const ratio = uploadDialogRatio;
        const uploadedUrls = await Promise.all(
          Array.from(files).map(async (f) => {
            const prepared = await prepareImageForUpload(f, mode, ratio);
            return uploadAsset(prepared);
          })
        );
        const previous = content.properties[index];
        const mergedGallery = Array.from(new Set([...(previous.images ?? [previous.image]), ...uploadedUrls]));
        updateProperty(index, {
          images: mergedGallery,
          image: mergedGallery[0] ?? previous.image,
        });
        setStatus("Property gallery uploaded. Save all changes to publish.");
      } catch (error) {
        setStatus((error as Error).message || "Property gallery upload failed");
      }
    });
  }

  async function handleTeamImageUpload(index: number, file: File | null) {
    if (!file) return;
    setStatus("Preparing image...");
    showUploadDialog(file, async (preparedFile) => {
      try {
        const url = await uploadAsset(preparedFile);
        updateTeamMember(index, { image: url });
        setStatus("Team image uploaded. Save all changes to publish.");
      } catch (error) {
        setStatus((error as Error).message || "Team image upload failed");
      }
    });
  }

  async function handleBlogSidebarImageUpload(index: number, file: File | null) {
    if (!file) return;
    setStatus("Preparing image...");
    showUploadDialog(file, async (preparedFile) => {
      try {
        const url = await uploadAsset(preparedFile);
        updateBlogSidebarItem(index, { image: url });
        setStatus("Blog sidebar image uploaded. Save all changes to publish.");
      } catch (error) {
        setStatus((error as Error).message || "Blog sidebar image upload failed");
      }
    });
  }

  async function handleArticleImageUpload(index: number, file: File | null) {
    if (!file) return;
    setStatus("Preparing image...");
    showUploadDialog(file, async (preparedFile) => {
      try {
        const url = await uploadAsset(preparedFile);
        updateArticle(index, { image: url });
        setStatus("Article image uploaded. Save all changes to publish.");
      } catch (error) {
        setStatus((error as Error).message || "Article image upload failed");
      }
    });
  }

  async function saveAll() {
    try {
      const parsedHomeChecklist = JSON.parse(homeChecklistJson);
      if (!Array.isArray(parsedHomeChecklist) || parsedHomeChecklist.some((item) => typeof item !== "string")) {
        throw new Error("invalid-checklist");
      }

      const nextContent: SiteContent = {
        ...content,
        homePage: {
          ...content.homePage,
          aboutChecklist: parsedHomeChecklist,
        },
        articles: content.articles,
        testimonials: content.companyTestimonials.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          text: item.text,
          stars: item.stars,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=c49a6c&color=fff&size=48`,
        })),
      };

      const response = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent),
      });

      if (!response.ok) {
        setStatus("Save failed");
        window.alert("Save failed. Please try again.");
        return;
      }

      setContent(nextContent);
      setStatus("Saved successfully. Your pages now use this content.");
      window.alert("Changes saved successfully.");
    } catch {
      setStatus("Save failed: JSON format is invalid");
      window.alert("Save failed. Please check the format and try again.");
    }
  }

  async function logout() {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (!response.ok) {
      setStatus("Logout failed");
      window.alert("Logout failed. Please try again.");
      return;
    }
    window.alert("Logged out successfully.");
    router.push("/admin/login");
    router.refresh();
  }

  async function changePassword() {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordStatus("Please fill all password fields.");
      setPasswordStatusType("error");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus("New password must be at least 8 characters.");
      setPasswordStatusType("error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordStatus("New password and confirm password do not match.");
      setPasswordStatusType("error");
      return;
    }

    setPasswordBusy(true);
    setPasswordStatus("Updating password...");
    setPasswordStatusType("idle");

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const raw = await response.text();
      let payload: { error?: string } | null = null;
      if (raw) {
        try {
          payload = JSON.parse(raw) as { error?: string };
        } catch {
          payload = null;
        }
      }
      if (!response.ok) {
        setPasswordStatus(payload?.error ?? "Could not change password.");
        setPasswordStatusType("error");
        setPasswordBusy(false);
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordStatus("Password updated successfully.");
      setPasswordStatusType("success");
      setPasswordBusy(false);
    } catch {
      setPasswordStatus("Could not change password.");
      setPasswordStatusType("error");
      setPasswordBusy(false);
    }
  }

  function updateProperty(index: number, patch: Partial<PropertyItem>) {
    setContent((prev) => ({
      ...prev,
      properties: prev.properties.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addProperty() {
    const nextId = Math.max(0, ...content.properties.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      properties: [
        ...prev.properties,
        {
          id: nextId,
          title: "New Property",
          price: "$ 0",
          status: "For Sale",
          active: "Active",
          statusColor: "#c49a6c",
          beds: 1,
          baths: 1,
          size: 100,
          year: new Date().getFullYear(),
          location: "Zanzibar",
          mapUrl: "https://maps.google.com/?q=Zanzibar",
          description: "Property description",
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
          images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80"],
          videoUrl: "",
          contactEmail: prev.contactActions.email,
          contactPhone: prev.contactActions.phone,
          otherMobilePhone: prev.contactActions.phone,
          contactWhatsapp: prev.contactActions.whatsapp,
        },
      ],
    }));
  }

  function removeProperty(index: number) {
    setContent((prev) => ({
      ...prev,
      properties: prev.properties.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateTeamMember(index: number, patch: Partial<CompanyTeamMember>) {
    setContent((prev) => ({
      ...prev,
      companyTeam: prev.companyTeam.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addTeamMember() {
    const nextId = Math.max(0, ...content.companyTeam.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      companyTeam: [
        ...prev.companyTeam,
        {
          id: nextId,
          name: "Staff name",
          role: "Role",
          description: "Short description",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
          email: prev.contactActions.email,
          phone: prev.contactActions.phone,
          whatsapp: prev.contactActions.whatsapp,
          facebook: "",
          instagram: "",
          linkedin: "",
        },
      ],
    }));
  }

  function removeTeamMember(index: number) {
    setContent((prev) => ({
      ...prev,
      companyTeam: prev.companyTeam.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateCompanyTestimonial(index: number, patch: Partial<CompanyTestimonialItem>) {
    setContent((prev) => ({
      ...prev,
      companyTestimonials: prev.companyTestimonials.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateBlogSidebarItem(index: number, patch: Partial<BlogSidebarItem>) {
    setContent((prev) => ({
      ...prev,
      blogSidebarItems: prev.blogSidebarItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addBlogSidebarItem() {
    const nextId = (content.blogSidebarItems.at(-1)?.id ?? 0) + 1;
    setContent((prev) => ({
      ...prev,
      blogSidebarItems: [
        ...prev.blogSidebarItems,
        {
          id: nextId,
          title: "New Sidebar Item",
          price: "$ 0",
          image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80",
          href: "/properties",
        },
      ],
    }));
  }

  function removeBlogSidebarItem(index: number) {
    setContent((prev) => ({
      ...prev,
      blogSidebarItems: prev.blogSidebarItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function addCompanyTestimonial() {
    const nextId = Math.max(0, ...content.companyTestimonials.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      companyTestimonials: [
        ...prev.companyTestimonials,
        {
          id: nextId,
          name: "Client Name",
          role: "Client Role",
          text: "Client feedback",
          stars: 5,
        },
      ],
    }));
  }

  function removeCompanyTestimonial(index: number) {
    setContent((prev) => ({
      ...prev,
      companyTestimonials: prev.companyTestimonials.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateArticle(index: number, patch: Partial<ArticleItem>) {
    setContent((prev) => ({
      ...prev,
      articles: prev.articles.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addArticle() {
    const nextId = Math.max(0, ...content.articles.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      articles: [
        ...prev.articles,
        {
          id: nextId,
          slug: `new-article-${nextId}`,
          title: "New Article Title",
          date: new Date().toLocaleDateString(),
          excerpt: "Short article summary",
          image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
          content: "Article content goes here.",
        },
      ],
    }));
  }

  function removeArticle(index: number) {
    setContent((prev) => ({
      ...prev,
      articles: prev.articles.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function removePropertyMainImage(index: number) {
    setContent((prev) => {
      const nextProperties = [...prev.properties];
      const current = nextProperties[index];
      if (!current) return prev;
      const nextImages = (current.images ?? []).filter((item) => item !== current.image);
      nextProperties[index] = {
        ...current,
        image: nextImages[0] ?? "",
        images: nextImages,
      };
      return { ...prev, properties: nextProperties };
    });
  }

  function removePropertyVideo(index: number) {
    updateProperty(index, { videoUrl: "" });
  }

  function removePropertyGalleryImage(index: number, imageUrl: string) {
    setContent((prev) => {
      const nextProperties = [...prev.properties];
      const current = nextProperties[index];
      if (!current) return prev;
      const nextImages = (current.images ?? []).filter((item) => item !== imageUrl);
      nextProperties[index] = {
        ...current,
        images: nextImages,
        image: current.image === imageUrl ? nextImages[0] ?? "" : current.image,
      };
      return { ...prev, properties: nextProperties };
    });
  }

  function removeTeamImage(index: number) {
    updateTeamMember(index, { image: "" });
  }

  function removeBlogSidebarImage(index: number) {
    updateBlogSidebarItem(index, { image: "" });
  }

  function removeArticleImage(index: number) {
    updateArticle(index, { image: "" });
  }

  return (
    <main style={{ backgroundColor: "#f3f4f7", minHeight: "100vh", padding: "30px 18px 50px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gap: "20px" }}>
        <header style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "30px", fontFamily: "Georgia, serif", color: "#1f2937" }}>Website Admin Panel</h1>
            <p style={{ margin: "8px 0 0", color: "#666", fontSize: "14px" }}>
              Manage pages from the left menu, then save changes.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={saveAll}
              style={{
                border: "none",
                backgroundColor: "#b7844c",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save All Changes
            </button>
            <button
              onClick={logout}
              style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "9px 14px", fontWeight: 600, cursor: "pointer" }}
            >
              Log out
            </button>
          </div>
        </header>

        <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "12px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Admin Security</h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>
            Change your admin password. Use at least 8 characters.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Current Password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px" }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>New Password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px" }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Confirm New Password</span>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px" }}
              />
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={changePassword}
              disabled={passwordBusy}
              style={{ border: "none", backgroundColor: "#1f2937", color: "#fff", borderRadius: "8px", padding: "10px 14px", fontWeight: 600, cursor: "pointer" }}
            >
              {passwordBusy ? "Updating..." : "Change Password"}
            </button>
            <p style={{ margin: 0, minHeight: "18px", fontSize: "12px", color: passwordStatusType === "success" ? "#166534" : "#7f1d1d" }}>{passwordStatus}</p>
          </div>
        </section>

        <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "18px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Image Upload Processing</h2>
              <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "13px" }}>
                Choose how uploaded images should be prepared before saving.
              </p>
            </div>
            <label style={{ display: "grid", gap: "6px", minWidth: "220px" }}>
              <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Default mode</span>
              <select
                value={imageUploadMode}
                onChange={(e) => setImageUploadMode(e.target.value as "resize" | "crop")}
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", backgroundColor: "#fff" }}
              >
                <option value="resize">Resize to fit</option>
                <option value="crop">Crop to square</option>
              </select>
            </label>
            {imageUploadMode === "crop" ? (
              <label style={{ display: "grid", gap: "6px", minWidth: "220px" }}>
                <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Crop ratio</span>
                <select
                  value={imageCropRatio}
                  onChange={(e) => setImageCropRatio(e.target.value as "square" | "landscape" | "portrait")}
                  style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", backgroundColor: "#fff" }}
                >
                  <option value="square">Square 1:1</option>
                  <option value="landscape">Landscape 16:9</option>
                  <option value="portrait">Portrait 4:5</option>
                </select>
              </label>
            ) : null}
          </div>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "12px", lineHeight: 1.6 }}>
            Resize keeps the original aspect ratio and reduces large files. Crop centers the image into a uniform frame using the selected ratio.
          </p>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "20px", alignItems: "start" }}>
          <aside style={{ backgroundColor: "#111827", color: "#fff", borderRadius: "14px", padding: "14px", position: "sticky", top: "12px" }}>
            <p style={{ margin: "8px 8px 12px", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9ca3af" }}>
              Pages
            </p>
            <div style={{ display: "grid", gap: "8px" }}>
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  style={{
                    textAlign: "left",
                    border: "1px solid",
                    borderColor: activeSection === item.key ? "#b7844c" : "#1f2937",
                    backgroundColor: activeSection === item.key ? "rgba(183,132,76,0.2)" : "#1f2937",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "14px",
                    fontWeight: activeSection === item.key ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          <div style={{ display: "grid", gap: "20px" }}>
            {activeSection === "home" && (
              <>
                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "18px" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Home Hero and Section Headings</h2>
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#f9fafb", display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: 700 }}>Company Logo</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Used in the main header and contact page</p>
                    </div>
                    <label style={{ display: "grid", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Upload Company Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCompanyLogoUpload(e.target.files?.[0] ?? null)}
                        style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                      />
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <img src={companyLogoUrl} alt="Company logo preview" style={{ height: "54px", width: "auto", objectFit: "contain", backgroundColor: "#fff", padding: "6px", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                      <div style={{ display: "grid", gap: "4px" }}>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>Current logo URL</span>
                        <span style={{ fontSize: "12px", color: "#374151", wordBreak: "break-all" }}>{companyLogoUrl}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => openMediaPreview(companyLogoUrl, "image", "Company Logo")}
                          style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={removeCompanyLogo}
                          style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                    {([
                      ["Hero Eyebrow", "heroEyebrow"],
                      ["Hero Title Line 1", "heroTitleLine1"],
                      ["Hero Title Line 2", "heroTitleLine2"],
                      ["Hero Background Image", "heroBackgroundImage"],
                      ["About Badge", "aboutBadge"],
                      ["About Title Line 1", "aboutTitleLine1"],
                      ["About Title Line 2", "aboutTitleLine2"],
                      ["About Intro Line 1", "aboutIntroLine1"],
                      ["About Intro Line 2", "aboutIntroLine2"],
                      ["About Intro Line 3", "aboutIntroLine3"],
                      ["Properties Badge", "propertiesBadge"],
                      ["Properties Title", "propertiesTitle"],
                      ["Properties Description", "propertiesDescription"],
                      ["Testimonials Badge", "testimonialsBadge"],
                      ["Testimonials Title", "testimonialsTitle"],
                      ["Testimonials Description", "testimonialsDescription"],
                      ["Blog Badge", "blogBadge"],
                      ["Blog Title", "blogTitle"],
                      ["Blog Description", "blogDescription"],
                    ] as const).map(([label, key]) => (
                      <label key={key} style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{label}</span>
                        <input
                          value={content.homePage[key]}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              homePage: {
                                ...prev.homePage,
                                [key]: e.target.value,
                              },
                            }))
                          }
                          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}
                        />
                      </label>
                    ))}
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#f9fafb", display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: 700 }}>Hero Background Preview</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Paste image URL or upload image and preview instantly</p>
                    </div>
                    <label style={{ display: "grid", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Upload Hero Background Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleHomeImageUpload(e.target.files?.[0] ?? null)}
                        style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                      />
                    </label>
                    <p style={{ margin: 0, fontSize: "12px", color: "#4b5563", lineHeight: 1.5 }}>
                      Valid image URL: public direct link ending with .jpg, .jpeg, .png, or .webp (example: https://example.com/hero.jpg).
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: 1.5 }}>
                      Avoid page links from Google Drive, Facebook, or links that need login because they will not show as a background image.
                    </p>
                    <div
                      style={{
                        height: "180px",
                        borderRadius: "8px",
                        backgroundColor: "#111827",
                        backgroundImage: heroPreviewBackground,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "1px solid #d1d5db",
                      }}
                    />
                    {!heroPreviewUrl && (
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Add a Hero Background Image URL to preview it here.
                      </p>
                    )}
                    {heroPreviewUrl ? (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => openMediaPreview(heroPreviewUrl, "image", "Hero Background Image")}
                          style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={removeHomeHeroImage}
                          style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <JsonEditor label="About checklist items (JSON array of strings)" value={homeChecklistJson} onChange={setHomeChecklistJson} />
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>Home Video Section</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                    {[
                      ["Badge", "badge"],
                      ["Heading Line 1", "headingLine1"],
                      ["Heading Line 2", "headingLine2"],
                      ["Helper Text", "helperText"],
                      ["Background Image URL", "backgroundImage"],
                      ["Video URL", "videoUrl"],
                    ].map(([label, key]) => (
                      <label key={key} style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{label}</span>
                        <input
                          value={content.videoSection[key as keyof SiteContent["videoSection"]]}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              videoSection: {
                                ...prev.videoSection,
                                [key]: e.target.value,
                              },
                            }))
                          }
                          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}
                        />
                      </label>
                    ))}
                  </div>
                  <div style={{ marginTop: "12px", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#f9fafb", display: "grid", gap: "10px" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: 700 }}>
                      Upload Media (if you do not have URLs)
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                      <label style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Video Section Background Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleVideoImageUpload(e.target.files?.[0] ?? null)}
                          style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                        />
                      </label>
                      <label style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Video File</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e.target.files?.[0] ?? null)}
                          style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                        />
                      </label>
                    </div>
                    <div style={{ display: "grid", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <div
                          style={{
                            width: "180px",
                            height: "100px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            backgroundColor: "#fff",
                            backgroundImage: content.videoSection.backgroundImage ? `url('${content.videoSection.backgroundImage}')` : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <div style={{ display: "grid", gap: "4px" }}>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>Current background image URL</span>
                          <span style={{ fontSize: "12px", color: "#374151", wordBreak: "break-all" }}>{content.videoSection.backgroundImage || "No image uploaded"}</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => openMediaPreview(content.videoSection.backgroundImage, "image", "Home Video Background")}
                            style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={removeVideoBackgroundImage}
                            style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ width: "180px", height: "100px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px" }}>
                          Video File
                        </div>
                        <div style={{ display: "grid", gap: "4px" }}>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>Current video URL</span>
                          <span style={{ fontSize: "12px", color: "#374151", wordBreak: "break-all" }}>{content.videoSection.videoUrl || "No video uploaded"}</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => openMediaPreview(content.videoSection.videoUrl, "video", "Home Video File")}
                            style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={removeVideoFile}
                            style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                      Uploaded files are saved to /public/uploads and their URLs are filled automatically.
                    </p>
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "10px" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Home Testimonials</h2>
                  <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
                    Home testimonials are linked to Our Company testimonials.
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                    Edit them from the sidebar page: Our Company {">"} Company Testimonials.
                  </p>
                </section>
              </>
            )}

            {activeSection === "properties" && (
              <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Properties</h2>
                  <button onClick={addProperty} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                    Add Property
                  </button>
                </div>

                <div style={{ display: "grid", gap: "14px" }}>
                  {content.properties.map((item, index) => (
                    <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", display: "grid", gap: "12px" }}>
                      {(() => {
                        const propertyImages = Array.isArray(item.images) && item.images.length > 0
                          ? item.images
                          : item.image
                            ? [item.image]
                            : [];
                        return (
                          <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Property #{item.id}</p>
                        <button onClick={() => removeProperty(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                          Remove
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                        {[
                          ["Title", item.title, "title"],
                          ["Price", item.price, "price"],
                          ["Location", item.location, "location"],
                          ["Location Map URL", item.mapUrl, "mapUrl"],
                          ["Image URL", item.image, "image"],
                          ["Contact Email", item.contactEmail, "contactEmail"],
                          ["Contact Phone", item.contactPhone, "contactPhone"],
                          ["Contact WhatsApp", item.contactWhatsapp, "contactWhatsapp"],
                        ].map(([label, value, key]) => (
                          <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                            <input
                              value={value as string}
                              onChange={(e) => updateProperty(index, { [key as keyof PropertyItem]: e.target.value } as Partial<PropertyItem>)}
                              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                            />
                          </label>
                        ))}

                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Rent or Sale</span>
                          <select
                            value={item.status}
                            onChange={(e) => updateProperty(index, { status: e.target.value })}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                          >
                            <option>For Sale</option>
                            <option>For Rent</option>
                            <option>For Rent & Sale</option>
                          </select>
                        </label>

                        {[
                          ["No. of Beds", item.beds, "beds"],
                          ["Baths", item.baths, "baths"],
                          ["Size (sq meters)", item.size, "size"],
                          ["Year Built", item.year, "year"],
                        ].map(([label, value, key]) => (
                          <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                            <input
                              type={key === "size" ? "text" : "number"}
                              value={key === "size" ? (value as number).toLocaleString() : (value as number)}
                              onChange={(e) => updateProperty(index, { [key as keyof PropertyItem]: Number(e.target.value.replace(/,/g, "")) } as Partial<PropertyItem>)}
                              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                              placeholder={key === "size" ? "e.g., 1,000" : undefined}
                            />
                          </label>
                        ))}
                      </div>

                      <label style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Description</span>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateProperty(index, { description: e.target.value })}
                          rows={3}
                          style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                        />
                      </label>

                      <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#f9fafb", display: "grid", gap: "10px" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: 700 }}>Property Video</p>
                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Video URL</span>
                          <input
                            value={item.videoUrl ?? ""}
                            onChange={(e) => updateProperty(index, { videoUrl: e.target.value })}
                            placeholder="Paste a video URL or upload one below"
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                          />
                        </label>
                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Upload Video File</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handlePropertyVideoUpload(index, e.target.files?.[0] ?? null)}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                          />
                        </label>
                      </div>

                      <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#f9fafb", display: "grid", gap: "10px" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: 700 }}>Property Photos (Multiple)</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                          <label style={{ display: "grid", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Upload Main Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePropertyMainImageUpload(index, e.target.files?.[0] ?? null)}
                              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                            />
                          </label>
                          <label style={{ display: "grid", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Upload More Photos</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handlePropertyGalleryUpload(index, e.target.files)}
                              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                            />
                          </label>
                        </div>
                        <div style={{ display: "grid", gap: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <div
                              style={{
                                width: "160px",
                                height: "90px",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                backgroundColor: "#fff",
                                backgroundImage: item.image ? `url('${item.image}')` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <div style={{ display: "grid", gap: "4px" }}>
                              <span style={{ fontSize: "12px", color: "#6b7280" }}>Current main image</span>
                              <span style={{ fontSize: "12px", color: "#374151", wordBreak: "break-all" }}>{item.image || "No image uploaded"}</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <button
                                type="button"
                                onClick={() => openMediaPreview(item.image, "image", `Property ${item.id} main image`)}
                                style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                              >
                                Preview
                              </button>
                              <button
                                type="button"
                                onClick={() => removePropertyMainImage(index)}
                                style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <div
                              style={{
                                width: "160px",
                                height: "90px",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                backgroundColor: "#0f172a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "12px",
                              }}
                            >
                              Video
                            </div>
                            <div style={{ display: "grid", gap: "4px" }}>
                              <span style={{ fontSize: "12px", color: "#6b7280" }}>Current property video</span>
                              <span style={{ fontSize: "12px", color: "#374151", wordBreak: "break-all" }}>{item.videoUrl || "No video uploaded"}</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <button
                                type="button"
                                onClick={() => openMediaPreview(item.videoUrl ?? "", "video", `Property ${item.id} video`)}
                                style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                              >
                                Preview
                              </button>
                              <button
                                type="button"
                                onClick={() => removePropertyVideo(index)}
                                style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Gallery URLs (one URL per line)</span>
                          <textarea
                            value={propertyImages.join("\n")}
                            onChange={(e) => {
                              const urls = e.target.value
                                .split("\n")
                                .map((line) => line.trim())
                                .filter((line) => line.length > 0);
                              updateProperty(index, {
                                images: urls,
                                image: urls[0] ?? item.image,
                              });
                            }}
                            rows={4}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "12px", fontFamily: "monospace", resize: "vertical", backgroundColor: "#fff" }}
                          />
                        </label>
                        {propertyImages.length > 0 ? (
                          <div style={{ display: "grid", gap: "8px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "40px 80px 1fr 160px", gap: "8px", alignItems: "center", fontSize: "12px", color: "#374151", fontWeight: 700 }}>
                              <div>#</div>
                              <div>Preview</div>
                              <div>URL</div>
                              <div style={{ textAlign: "right" }}>Actions</div>
                            </div>

                            {propertyImages.map((imageUrl, imageIndex) => (
                              <div key={`${item.id}-${imageIndex}`} style={{ display: "grid", gridTemplateColumns: "40px 80px 1fr 160px", gap: "8px", alignItems: "center", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#fff" }}>
                                <div style={{ fontSize: "13px", color: "#6b7280" }}>{imageIndex + 1}</div>
                                <div style={{ width: "72px", height: "54px", borderRadius: "6px", backgroundImage: `url('${imageUrl}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                                <div style={{ fontSize: "12px", color: "#374151", wordBreak: "break-all" }}>{imageUrl}</div>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                  <button
                                    type="button"
                                    onClick={() => openMediaPreview(imageUrl, "image", `Property ${item.id} gallery image ${imageIndex + 1}`)}
                                    style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                                  >
                                    Preview
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removePropertyGalleryImage(index, imageUrl)}
                                    style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                          </>
                        );
                      })()}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "company" && (
              <>
                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Meet Our Team Cards</h2>
                    <button onClick={addTeamMember} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                      Add Staff Card
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "14px" }}>
                    {content.companyTeam.map((member, index) => (
                      <article key={member.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", display: "grid", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Staff #{member.id}</p>
                          <button onClick={() => removeTeamMember(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                            Remove
                          </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                          {[
                            ["Name", member.name, "name"],
                            ["Role", member.role, "role"],
                            ["Image URL", member.image, "image"],
                            ["Email", member.email, "email"],
                            ["Phone", member.phone, "phone"],
                            ["WhatsApp", member.whatsapp, "whatsapp"],
                            ["Facebook URL", member.facebook, "facebook"],
                            ["Instagram URL", member.instagram, "instagram"],
                            ["LinkedIn URL", member.linkedin, "linkedin"],
                          ].map(([label, value, key]) => (
                            <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                              <input
                                value={value as string}
                                onChange={(e) => updateTeamMember(index, { [key as keyof CompanyTeamMember]: e.target.value } as Partial<CompanyTeamMember>)}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                              />
                            </label>
                          ))}
                        </div>

                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Upload Staff Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTeamImageUpload(index, e.target.files?.[0] ?? null)}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                          />
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                          <div
                            style={{
                              width: "120px",
                              height: "160px",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                              backgroundColor: "#fff",
                              backgroundImage: member.image ? `url('${member.image}')` : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "top center",
                            }}
                          />
                          <div style={{ display: "grid", gap: "4px" }}>
                            <span style={{ fontSize: "12px", color: "#6b7280" }}>Current staff image</span>
                            <span style={{ fontSize: "12px", color: "#374151", wordBreak: "break-all" }}>{member.image || "No image uploaded"}</span>
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              type="button"
                              onClick={() => openMediaPreview(member.image, "image", `Staff ${member.id} image`)}
                              style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => removeTeamImage(index)}
                              style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Description</span>
                          <textarea
                            value={member.description}
                            onChange={(e) => updateTeamMember(index, { description: e.target.value })}
                            rows={3}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                          />
                        </label>
                      </article>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Company Testimonials</h2>
                    <button onClick={addCompanyTestimonial} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                      Add Testimonial
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {content.companyTestimonials.map((item, index) => (
                      <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", display: "grid", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Testimonial #{item.id}</p>
                          <button onClick={() => removeCompanyTestimonial(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                            Remove
                          </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                          {[
                            ["Name", item.name, "name"],
                            ["Role", item.role, "role"],
                          ].map(([label, value, key]) => (
                            <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                              <input
                                value={value as string}
                                onChange={(e) => updateCompanyTestimonial(index, { [key as keyof CompanyTestimonialItem]: e.target.value } as Partial<CompanyTestimonialItem>)}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                              />
                            </label>
                          ))}
                          <label style={{ display: "grid", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Stars</span>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={item.stars}
                              onChange={(e) => updateCompanyTestimonial(index, { stars: Number(e.target.value) })}
                              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                            />
                          </label>
                        </div>
                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Testimonial Text</span>
                          <textarea
                            value={item.text}
                            onChange={(e) => updateCompanyTestimonial(index, { text: e.target.value })}
                            rows={3}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                          />
                        </label>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeSection === "blog" && (
              <>
                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Blog Articles</h2>
                      <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "13px" }}>Edit the posts shown on the blog list and article pages.</p>
                    </div>
                    <button onClick={addArticle} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                      Add Article
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "14px" }}>
                    {content.articles.map((item, index) => (
                      <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", backgroundColor: "#fff" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "14px", padding: "14px" }}>
                          <div
                            style={{
                              minHeight: "140px",
                              borderRadius: "10px",
                              backgroundImage: `url('${item.image}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div style={{ display: "grid", gap: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                              <div>
                                <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Article #{item.id}</p>
                                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>Used on the blog list and blog details page</p>
                              </div>
                              <button onClick={() => removeArticle(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                                Remove
                              </button>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                              {[
                                ["Slug", item.slug, "slug"],
                                ["Title", item.title, "title"],
                                ["Date", item.date, "date"],
                                ["Image URL", item.image, "image"],
                              ].map(([label, value, key]) => (
                                <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                                  <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                                  <input
                                    value={value as string}
                                    onChange={(e) => updateArticle(index, { [key as keyof ArticleItem]: e.target.value } as Partial<ArticleItem>)}
                                    style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                                  />
                                </label>
                              ))}
                            </div>

                            <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Upload Article Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleArticleImageUpload(index, e.target.files?.[0] ?? null)}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                              />
                            </label>

                            <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Excerpt</span>
                              <textarea
                                value={item.excerpt}
                                onChange={(e) => updateArticle(index, { excerpt: e.target.value })}
                                rows={3}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                              />
                            </label>

                            <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Article Content</span>
                              <textarea
                                value={item.content}
                                onChange={(e) => updateArticle(index, { content: e.target.value })}
                                rows={6}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                              />
                            </label>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Blog Sidebar Items</h2>
                    <button onClick={addBlogSidebarItem} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                      Add Sidebar Item
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {content.blogSidebarItems.map((item, index) => (
                      <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", display: "grid", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Sidebar Item #{item.id}</p>
                          <button onClick={() => removeBlogSidebarItem(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                            Remove
                          </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                          {[
                            ["Title", item.title, "title"],
                            ["Price", item.price, "price"],
                            ["Image URL", item.image, "image"],
                            ["Link", item.href, "href"],
                          ].map(([label, value, key]) => (
                            <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                              <input
                                value={value as string}
                                onChange={(e) => updateBlogSidebarItem(index, { [key as keyof BlogSidebarItem]: e.target.value } as Partial<BlogSidebarItem>)}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                              />
                            </label>
                          ))}
                        </div>

                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 600 }}>Upload Sidebar Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBlogSidebarImageUpload(index, e.target.files?.[0] ?? null)}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px", fontSize: "12px", backgroundColor: "#fff" }}
                          />
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                          <div
                            style={{
                              width: "150px",
                              height: "90px",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                              backgroundColor: "#fff",
                              backgroundImage: item.image ? `url('${item.image}')` : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div style={{ display: "grid", gap: "4px" }}>
                            <span style={{ fontSize: "12px", color: "#6b7280" }}>Current sidebar image</span>
                            <span style={{ fontSize: "12px", color: "#374151", wordBreak: "break-all" }}>{item.image || "No image uploaded"}</span>
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              type="button"
                              onClick={() => openMediaPreview(item.image, "image", `Sidebar item ${item.id} image`)}
                              style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBlogSidebarImage(index)}
                              style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeSection === "contact" && (
              <>
                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>Contact Actions</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                    {[
                      ["Phone", content.contactActions.phone, "phone"],
                      ["Email", content.contactActions.email, "email"],
                      ["WhatsApp Number", content.contactActions.whatsapp, "whatsapp"],
                      ["WhatsApp Message", content.contactActions.whatsappMessage, "whatsappMessage"],
                    ].map(([label, value, key]) => (
                      <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{label}</span>
                        <input
                          value={value as string}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              contactActions: {
                                ...prev.contactActions,
                                [key as "phone" | "email" | "whatsapp" | "whatsappMessage"]: e.target.value,
                              },
                            }))
                          }
                          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}
                        />
                      </label>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>Contact Form Settings</h2>
                  <label style={{ display: "grid", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>How did you hear about us? (Options)</span>
                    <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#666" }}>
                      One option per line
                    </p>
                    <textarea
                      value={contactFormOptions.join("\n")}
                      onChange={(e) => {
                        const options = e.target.value
                          .split("\n")
                          .map((opt) => opt.trim())
                          .filter((opt) => opt.length > 0);
                        setContent((prev) => ({
                          ...prev,
                          contactFormSettings: {
                            ...(prev.contactFormSettings ?? defaultSiteContent.contactFormSettings),
                            hearAboutUsOptions: options,
                          },
                        }));
                      }}
                      rows={8}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        fontSize: "13px",
                        fontFamily: "monospace",
                        resize: "vertical",
                      }}
                    />
                  </label>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>How Did You Hear About Us Counts</h2>
                  <p style={{ margin: "0 0 14px", color: "#666", fontSize: "13px" }}>
                    Number of clients who selected each option.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                    {hearAboutUsCounts.map((item) => (
                      <div key={item.option} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#fafafa" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#4b5563", fontWeight: 600 }}>{item.option}</p>
                        <p style={{ margin: "6px 0 0", fontSize: "22px", color: "#111827", fontWeight: 700 }}>{item.count}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", overflowX: "auto" }}>
                  <h2 style={{ margin: "0 0 10px", fontSize: "20px", color: "#111827" }}>Client List from Contact Forms</h2>
                  <p style={{ margin: "0 0 16px", color: "#666", fontSize: "13px" }}>
                    Total: {leadStats.total} | Home: {leadStats.home} | Contact: {leadStats.contact} | Company: {leadStats.company}
                  </p>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "820px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc" }}>
                        {[
                          "Date",
                          "Source",
                          "Name",
                          "Email",
                          "Phone",
                          "Message",
                          "How Heard",
                        ].map((head) => (
                          <th key={head} style={{ textAlign: "left", padding: "10px 8px", fontSize: "12px", color: "#475569", borderBottom: "1px solid #e5e7eb" }}>
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((item) => (
                        <tr key={item.id}>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{new Date(item.createdAt).toLocaleString()}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{item.source}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{item.name}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{item.email}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{item.phone}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px", maxWidth: "360px" }}>{item.message}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px", maxWidth: "220px" }}>
                            {Array.isArray(item.hearAboutUs) && item.hearAboutUs.length > 0 ? item.hearAboutUs.join(", ") : "-"}
                          </td>
                        </tr>
                      ))}
                      {submissions.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ padding: "16px 8px", color: "#6b7280", fontSize: "13px" }}>
                            No contact submissions yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </>
            )}

            <p style={{ margin: "-8px 0 0", color: "#666", fontSize: "13px" }}>{status}</p>
          </div>
        </div>
      </div>

      {pendingUploadFile ? (
        <div
          onClick={closeUploadDialog}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 4001,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: uploadDialogMode === "crop" ? "700px" : "520px",
              backgroundColor: "#fff",
              borderRadius: "14px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
              padding: "24px",
              display: "grid",
              gap: "18px",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 8px", fontSize: "20px", color: "#111827", fontWeight: 700 }}>Process Image</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Choose how to prepare {pendingUploadFile.file.name} before uploading.</p>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>Processing Mode</span>
                <select
                  value={uploadDialogMode}
                  onChange={(e) => setUploadDialogMode(e.target.value as "resize" | "crop")}
                  style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", backgroundColor: "#fff" }}
                >
                  <option value="resize">Resize to fit</option>
                  <option value="crop">Crop to ratio</option>
                </select>
              </label>

              {uploadDialogMode === "crop" ? (
                <label style={{ display: "grid", gap: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>Crop Ratio</span>
                  <select
                    value={uploadDialogRatio}
                    onChange={(e) => setUploadDialogRatio(e.target.value as "square" | "landscape" | "portrait")}
                    style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", backgroundColor: "#fff" }}
                  >
                    <option value="square">Square 1:1</option>
                    <option value="landscape">Landscape 16:9</option>
                    <option value="portrait">Portrait 4:5</option>
                  </select>
                </label>
              ) : null}

              <p style={{ margin: 0, padding: "10px 12px", backgroundColor: "#f0fdf4", borderRadius: "8px", fontSize: "12px", color: "#166534", lineHeight: 1.5 }}>
                {uploadDialogMode === "resize"
                  ? "The image will be scaled down to max 1600px while preserving its original proportions."
                  : `The image will be cropped using the selected ratio: ${uploadDialogRatio === "square" ? "1:1" : uploadDialogRatio === "landscape" ? "16:9" : "4:5"}.`}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={closeUploadDialog}
                style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "10px 18px", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmUploadDialog}
                style={{ border: "none", backgroundColor: "#111827", color: "#fff", borderRadius: "8px", padding: "10px 18px", fontWeight: 600, cursor: "pointer" }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {mediaPreview ? (
        <div
          onClick={closeMediaPreview}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 4000,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "900px",
              backgroundColor: "#fff",
              borderRadius: "14px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
              padding: "18px",
              display: "grid",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>{mediaPreview.title}</h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280", wordBreak: "break-all" }}>{mediaPreview.url}</p>
              </div>
              <button
                type="button"
                onClick={closeMediaPreview}
                style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "8px 12px", fontWeight: 600, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
            {mediaPreview.kind === "image" ? (
              <img
                src={mediaPreview.url}
                alt={mediaPreview.title}
                style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "12px", backgroundColor: "#f3f4f6" }}
              />
            ) : (
              <video
                src={mediaPreview.url}
                controls
                autoPlay
                style={{ width: "100%", maxHeight: "70vh", borderRadius: "12px", backgroundColor: "#0f172a" }}
              />
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}

export type ContactActions = {
  phone: string;
  email: string;
  whatsapp: string;
  whatsappMessage: string;
};

export type ContactFormSettings = {
  hearAboutUsOptions: string[];
};

export type VideoSectionContent = {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  helperText: string;
  backgroundImage: string;
  videoUrl: string;
};

export type HomePageContent = {
  companyLogoUrl: string;
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroBackgroundImage: string;
  aboutBadge: string;
  aboutTitleLine1: string;
  aboutTitleLine2: string;
  aboutIntroLine1: string;
  aboutIntroLine2: string;
  aboutIntroLine3: string;
  aboutChecklist: string[];
  propertiesBadge: string;
  propertiesTitle: string;
  propertiesDescription: string;
  testimonialsBadge: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  blogBadge: string;
  blogTitle: string;
  blogDescription: string;
};

export type PropertyItem = {
  id: number;
  title: string;
  price: string;
  status: string;
  active: string;
  statusColor: string;
  beds: number;
  baths: number;
  size: number;
  year: number;
  location: string;
  mapUrl: string;
  description: string;
  image: string;
  images?: string[];
  contactEmail: string;
  contactPhone: string;
  otherMobilePhone: string;
  contactWhatsapp: string;
};

export type CompanyTeamMember = {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  email: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  linkedin: string;
};

export type CompanyTestimonialItem = {
  id: number;
  name: string;
  role: string;
  text: string;
  stars: number;
};

export type TestimonialItem = {
  id: number;
  name: string;
  role: string;
  text: string;
  stars: number;
  avatar: string;
};

export type ArticleItem = {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
};

export type BlogSidebarItem = {
  id: number;
  title: string;
  price: string;
  image: string;
  href: string;
};

export type SiteContent = {
  contactActions: ContactActions;
  contactFormSettings: ContactFormSettings;
  homePage: HomePageContent;
  videoSection: VideoSectionContent;
  properties: PropertyItem[];
  companyTeam: CompanyTeamMember[];
  companyTestimonials: CompanyTestimonialItem[];
  blogSidebarItems: BlogSidebarItem[];
  testimonials: TestimonialItem[];
  articles: ArticleItem[];
};

export type ContactSubmission = {
  id: string;
  createdAt: string;
  source: "home" | "contact" | "company";
  name: string;
  email: string;
  phone: string;
  message: string;
  hearAboutUs: string[];
};

export const defaultSiteContent: SiteContent = {
  contactActions: {
    phone: "+255659740712",
    email: "archipelagoproperties.zanzibar@gmail.com",
    whatsapp: "+255659740712",
    whatsappMessage: "Hello Archipelago Estates, I want to know more about your properties.",
  },
  contactFormSettings: {
    hearAboutUsOptions: [
      "Facebook",
      "Instagram",
      "TikTok",
      "LinkedIn",
      "Google Search",
      "Word of Mouth",
      "A Friend",
      "Previous Client",
    ],
  },
  homePage: {
    companyLogoUrl: "/logo.webp",
    heroEyebrow: "MAKE YOUR NEXT MOVE WITH US",
    heroTitleLine1: "Your Future Home",
    heroTitleLine2: "Starts Here",
    heroBackgroundImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80",
    aboutBadge: "ABOUT US",
    aboutTitleLine1: "Find Your Perfect Property",
    aboutTitleLine2: "in Zanzibar",
    aboutIntroLine1: "Buy land, own a home, or rent a property with Archipelago Property Zanzibar.",
    aboutIntroLine2: "We support both local and foreign investors with legal documents, land regulations, and ZIPA investment procedures.",
    aboutIntroLine3: "Our service is safe, transparent, and trusted across Zanzibar.",
    aboutChecklist: [
      "Secure Land Purchases",
      "Buy or Rent Quality Properties",
      "Complete Legal and Government Support",
      "Investor Guidance with ZIPA",
    ],
    propertiesBadge: "ARCHIPELAGO PROPERTY ZANZIBAR",
    propertiesTitle: "Our Latest Properties",
    propertiesDescription: "Browse our newest properties available for sale or rent. Each listing is chosen to meet high standards of quality, safety, and location.",
    testimonialsBadge: "TESTIMONIALS",
    testimonialsTitle: "What Clients Say",
    testimonialsDescription: "Real feedback from clients who successfully invested with our support",
    blogBadge: "OUR BLOG",
    blogTitle: "Read From Our Articles",
    blogDescription: "Learn everything you need to know about property laws, ownership, and investment in Zanzibar",
  },
  videoSection: {
    badge: "THE BEST REAL ESTATE COMPANY",
    headingLine1: "Watch this video",
    headingLine2: "to know us better",
    helperText: "Tap to open the video player",
    backgroundImage: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=1800&q=80",
    videoUrl: "https://filesamples.com/samples/video/mp4/sample_960x540.mp4",
  },
  properties: [
    {
      id: 1,
      title: "Sample Property in Zanzibar 1",
      price: "$ 770,000",
      status: "For Sale",
      active: "Active",
      statusColor: "#c49a6c",
      beds: 5,
      baths: 6,
      size: 190,
      year: 1982,
      location: "Mlandege, Zanzibar",
      mapUrl: "https://maps.google.com/?q=Mlandege,+Zanzibar",
      description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
      image: "https://images.unsplash.com/photo-1540541338537-ad197cffc7f8?w=600&q=80",
      contactEmail: "info@archipelagoestates.com",
      contactPhone: "+255659740712",
      otherMobilePhone: "+255659740712",
      contactWhatsapp: "+255659740712",
    },
    {
      id: 2,
      title: "Sample Property in Zanzibar 2",
      price: "$ 770,000",
      status: "For Rent",
      active: "Active",
      statusColor: "#c49a6c",
      beds: 5,
      baths: 6,
      size: 190,
      year: 1982,
      location: "Nungwi, Zanzibar",
      mapUrl: "https://maps.google.com/?q=Nungwi,+Zanzibar",
      description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      contactEmail: "info@archipelagoestates.com",
      contactPhone: "+255659740712",
      otherMobilePhone: "+255659740712",
      contactWhatsapp: "+255659740712",
    },
    {
      id: 3,
      title: "Sample Property in Zanzibar 3",
      price: "$ 770,000",
      status: "For Sale",
      active: "Active",
      statusColor: "#c49a6c",
      beds: 5,
      baths: 5,
      size: 190,
      year: 1982,
      location: "Stone Town, Zanzibar",
      mapUrl: "https://maps.google.com/?q=Stone+Town,+Zanzibar",
      description: "This property is mostly wooded and sits high on a hilltop overlooking the Mohawk River Val ...",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
      contactEmail: "info@archipelagoestates.com",
      contactPhone: "+255659740712",
      otherMobilePhone: "+255659740712",
      contactWhatsapp: "+255659740712",
    }
  ],
  companyTeam: [
    {
      id: 1,
      name: "Archipelago Property Zanzibar",
      role: "Real estate agency",
      description: "Trusted advisors helping buyers, sellers, and investors make confident property decisions in Zanzibar.",
      image: "/logo.webp",
      email: "info@archipelagoestates.com",
      phone: "+255659740712",
      whatsapp: "+255659740712",
      facebook: "",
      instagram: "",
      linkedin: "",
    },
  ],
  companyTestimonials: [
    {
      id: 1,
      name: "Shamia Aziz",
      role: "Happy Buyer",
      text: "Great service and a very helpful team. They guided me through the whole process and made buying property in Zanzibar easy.",
      stars: 5,
    },
    {
      id: 2,
      name: "Shamis Aziz",
      role: "Happy Seller",
      text: "Professional support from start to finish. The team handled legal details clearly and helped us complete the transaction safely.",
      stars: 5,
    },
    {
      id: 3,
      name: "Sharima Aziz",
      role: "Happy Investor",
      text: "I appreciated the transparency and clear communication. They helped me understand all steps before committing to the deal.",
      stars: 5,
    },
  ],
  blogSidebarItems: [
    {
      id: 1,
      title: "Sample Property in Zanzibar 3",
      price: "$ 770,000",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
      href: "/properties",
    },
    {
      id: 2,
      title: "Sample Property in Zanzibar 2",
      price: "$ 770,000",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200&q=80",
      href: "/properties",
    },
    {
      id: 3,
      title: "Sample Property in Zanzibar 1",
      price: "$ 770,000",
      image: "https://images.unsplash.com/photo-1540541338537-ad197cffc7f8?w=200&q=80",
      href: "/properties",
    },
  ],
  testimonials: [
    {
      id: 1,
      name: "Shamis Aziz",
      role: "Happy Seller",
      text: "Great service and very helpful team. They guided me through the whole process and made buying property in Zanzibar easy and stress-free",
      stars: 5,
      avatar: "https://ui-avatars.com/api/?name=Shamis+Aziz&background=c49a6c&color=fff&size=48"
    },
    {
      id: 2,
      name: "Shamis Aziz",
      role: "Happy Seller",
      text: "Great service and very helpful team. They guided me through the whole process and made buying property in Zanzibar easy and stress-free",
      stars: 5,
      avatar: "https://ui-avatars.com/api/?name=Shamis+Aziz&background=c49a6c&color=fff&size=48"
    },
    {
      id: 3,
      name: "Shamis Aziz",
      role: "Happy Buyer",
      text: "Great service and very helpful team. They guided me through the whole process and made buying property in Zanzibar easy and stress-free",
      stars: 5,
      avatar: "https://ui-avatars.com/api/?name=Shamis+Aziz&background=c49a6c&color=fff&size=48"
    }
  ],
  articles: [
    {
      id: 1,
      slug: "buying-land-zanzibar",
      title: "Complete Guide to Buying Land in Zanzibar",
      date: "December 14, 2025",
      excerpt: "Buying land in Zanzibar is a great opportunity for both local buyers and foreign investors. Zanzibar offers strong ...",
      image: "https://images.unsplash.com/photo-1582610116397-edb72c0ff479?w=600&q=80",
      content: "Buying land in Zanzibar is a great opportunity for both local buyers and foreign investors. Zanzibar offers strong economic growth, beautiful landscapes, and a growing real estate market.\n\nWhether you are looking for beachfront property, agricultural land, or urban plots, Zanzibar has a wide variety of options. The process of buying land involves working with the Zanzibar Investment Promotion Authority (ZIPA) and the Ministry of Land."
    },
    {
      id: 2,
      slug: "zipa-approval-foreign-property",
      title: "How ZIPA Approval Works for Foreign Property Investors",
      date: "December 14, 2025",
      excerpt: "Zanzibar is one of the most attractive destinations for foreign property investors. Its growing tourism industry, s ...",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      content: "Zanzibar is one of the most attractive destinations for foreign property investors. The Zanzibar Investment Promotion Authority (ZIPA) is the government body that facilitates and regulates foreign investment on the island.\n\nTo invest in real estate as a foreigner, you must obtain a Certificate of Incentives from ZIPA."
    },
    {
      id: 3,
      slug: "best-travel-experiences",
      title: "Best Travel Experiences and Property Opportunities in Zanzibar",
      date: "March 4, 2016",
      excerpt: "Zanzibar is a beautiful island destination that offers more than just holidays. It is a place where you can enjoy a ...",
      image: "https://images.unsplash.com/photo-1540541338537-ad197cffc7f8?w=600&q=80",
      content: "Zanzibar is a beautiful island destination that offers more than just holidays. It is a place where you can enjoy a unique blend of culture, history, and natural beauty while also exploring excellent property investment opportunities."
    }
  ]
};

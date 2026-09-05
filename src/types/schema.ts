/**
 * Global data contracts.
 *
 * Every layout variant inside a category consumes the SAME interface below.
 * Swapping a variant must never require a data-shape change.
 */

/* --- NAVBAR --- */
export interface NavbarData {
  logoUrl: string;
  orgName: string;
  navigationLinks: Array<{ label: string; href: string }>;
  emergencyPhone?: string;
  email?: string;
  donateLabel?: string;
}

/* --- HERO --- */
export interface HeroMedia {
  id: string;
  mediaUri: string;
  caption?: string;
  isVideo?: boolean;
}

export interface HeroData {
  headline: string;
  subHeadline: string;
  primaryCtaLabel: string;
  secondaryCtaLabel?: string;
  backgroundMedia: HeroMedia[];
  badges?: Array<{ label: string; value: string }>;
  activeCampaign?: {
    title: string;
    targetAmount: number;
    raisedAmount: number;
    donorCount: number;
    currencySymbol: string;
  };
}

/* --- PROGRAMS --- */
export interface ProgramItem {
  id: string;
  title: string;
  categoryTag: string;
  shortDescription: string;
  fullDescription: string;
  targetGroup: string;
  location: string;
  imageUri: string;
  metricsAchieved?: string;
}

export interface ProgramsData {
  sectionTitle: string;
  sectionSubtitle: string;
  programs: ProgramItem[];
}

/* --- IMPACT --- */
export interface ImpactStat {
  id: string;
  metricNumber: string;
  metricLabel: string;
  metricContext?: string;
  contextNote?: string;
  chartData?: Array<{ month: string; val: number }>;
  /** Optional series for recharts visualisers: monthly beneficiaries etc. */
  series?: Array<{ label: string; value: number }>;
}

export interface ImpactStory {
  id: string;
  beneficiaryName: string;
  quote: string;
  storyBody: string;
  imageUri: string;
  programTag?: string;
  authorTitle?: string;
}

export interface ImpactData {
  sectionTitle: string;
  sectionSubtitle: string;
  stats: ImpactStat[];
  stories?: ImpactStory[];
  trend?: Array<{ period: string; beneficiaries: number; meals: number }>;
}

/* --- GALLERY --- */
export type GalleryCategory =
  | "Education"
  | "Shelter"
  | "Healthcare"
  | "Events"
  | "General";

export interface GalleryItem {
  id: string;
  title: string;
  categoryTag: GalleryCategory;
  mediaUri: string;
  thumbnailUri?: string;
  isVideo: boolean;
}

export interface GalleryData {
  sectionTitle: string;
  sectionSubtitle?: string;
  items: GalleryItem[];
}

/* --- EVENTS & NEWS --- */
export interface EventItem {
  id: string;
  title: string;
  /** ISO 8601 date string */
  date: string;
  timeLocation: string;
  description: string;
  imageUri?: string;
  ctaLabel?: string;
  ctaHref?: string;
  isPast?: boolean;
  organizerTag?: string;
  rsvpHref?: string;
}

export interface EventsData {
  sectionTitle: string;
  sectionSubtitle?: string;
  events: EventItem[];
}

/* --- DONATION / BANKING --- */
export interface BankAccountDetails {
  id?: string | number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode?: string;
  logoUrl?: string;
}

/* --- FOOTER --- */
export interface FooterData {
  orgName: string;
  registrationNumber: string;
  missionStatement: string;
  address: string;
  phone: string;
  phones?: string[];
  email: string;
  bankAccounts: BankAccountDetails[];
  quickLinks: Array<{ label: string; href: string }>;
  legalLinks?: Array<{ label: string; href: string }>;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
  };
}

/* --- FIXED CORE SECTIONS --- */
export interface AboutData {
  sectionTitle: string;
  foundingNarrative: string;
  charterVerified?: boolean;
  registrationNumber?: string;
  timeline: Array<{ year: string; title: string; description: string }>;
  imageUri?: string;
}

export interface MissionData {
  sectionTitle: string;
  missionStatement: string;
  visionStatement?: string;
  pillars: Array<{ id: string; title: string; description: string; icon?: string }>;
}

export interface ContactData {
  sectionTitle: string;
  address: string;
  phones: string[];
  email: string;
  mapEmbedUrl: string;
  officeHours?: string;
}

/* --- MODAL --- */
export type ModalType = "donation" | "volunteer" | "video" | null;

/* --- VOLUNTEER PORTAL (public form section content) --- */
export interface VolunteerData {
  sectionTitle: string;
  sectionSubtitle?: string;
  servicePillars: Array<{ id: string; title: string; description?: string }>;
  skillOptions: string[];
  availabilityOptions: string[];
}

/* --- FORMS --- */
export interface ContactInquiry {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export type VolunteerStatus = "New" | "Contacted" | "Approved" | "Archived";

export interface VolunteerApplication {
  fullName: string;
  email: string;
  phone: string;
  servicePillar: string;
  availability: string[];
  skills: string[];
  motivation: string;
  cvFileName?: string;
  status?: VolunteerStatus;
}

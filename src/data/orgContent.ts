const img = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const orgContent = {
  /** Branding shown across the admin console (OCMS) and its login screen. */
  admin: {
    productName: "Link4Good OCMS",
    demoAdminDisplayName: "Link4Good Administrator",
    financeEmail: "finance@link4good.org",
    supportEmail: "hello@link4good.org",
  },
  /** Fallback SEO metadata used by routes that don't define their own. */
  seo: {
    siteName: "Link4Good",
    defaultTitle: "Link4Good — Dignity, Shelter & Education for Every Child",
    defaultDescription:
      "Link4Good is a registered charity providing shelter, education and healthcare to children and families, with audited reporting and zero-fee local giving.",
  },
  navbar: {
    logoUrl: "",
    orgName: "Link4Good",
    tagline: "Child Welfare & Community Care",
    emergencyPhone: "+251 911 000 000",
    email: "hello@link4good.org",
    donateLabel: "Donate Now",
    navigationLinks: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Programs", href: "/programs" },
      { label: "Impact", href: "/impact" },
      { label: "Gallery", href: "/gallery" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
    primaryBankAccount: {
      id: "cbe",
      bankName: "Commercial Bank of Ethiopia",
      accountName: "Link4Good Charitable Organization",
      accountNumber: "1000 2345 6789 01",
      swiftCode: "CBETETAA",
    },
    primaryAction: { label: "Donate Now", modal: "donation" },
    secondaryAction: { label: "Volunteer", modal: "volunteer" },
  },
  hero: {
    eyebrow: "Registered Ethiopian Charity · Reg. No. 4127/2016",
    headline: "Every child deserves a safe place to grow",
    subHeadline:
      "Link4Good provides shelter, nutrition, healthcare and education to vulnerable children and elders across Ethiopia — funded entirely by people like you.",
    primaryCtaLabel: "Donate Now",
    secondaryCtaLabel: "Watch Our Story",
    trustBadges: [
      "Audited annually",
      "100% of gifts reach the field",
      "12 years of service",
    ],
    badges: [
      { label: "Children supported", value: "18,420" },
      { label: "Meals served", value: "1.2M" },
      { label: "Community centers", value: "37" },
    ],
    backgroundMedia: [
      { id: "s1", mediaUri: img("photo-1488521787991-ed7bbaae773c"), caption: "Morning classes at the Addis center" },
      { id: "s2", mediaUri: img("photo-1497486751825-1233686d5d80"), caption: "Weekly nutrition distribution" },
      { id: "s3", mediaUri: img("photo-1509099836639-18ba1795216d"), caption: "Mobile healthcare outreach" },
    ],
    videoUri: "https://www.youtube.com/embed/ysz5S6PUM-U",
    activeCampaign: {
      title: "Winter Shelter Emergency Appeal",
      targetAmount: 2500000,
      raisedAmount: 1712400,
      donorCount: 3874,
      currencySymbol: "ETB",
      deadline: "2026-12-31",
    },
  },
  programs: {
    sectionTitle: "What we do",
    sectionSubtitle:
      "Four operational pillars, delivered daily by 240 staff and volunteers.",
    programs: [
      {
        id: "p1",
        title: "Safe Shelter & Family Care",
        categoryTag: "Shelter",
        shortDescription:
          "Round-the-clock residential care for children rescued from the streets.",
        fullDescription:
          "Our shelters provide a bed, three meals, trauma counselling and a caseworker for every child. Wherever possible we reunify children with vetted family members and continue support for 24 months.",
        highlights: ["24/7 residential care", "Trauma counselling", "Family reunification"],
        targetGroup: "Children aged 4–17",
        location: "Addis Ababa · Adama · Hawassa",
        imageUri: img("photo-1518495973542-4542c06a5843"),
        metricsAchieved: "1,940 children housed since 2014",
      },
      {
        id: "p2",
        title: "Nutrition & Daily Meals",
        categoryTag: "Nutrition",
        shortDescription:
          "Hot meals and supplementary feeding for children and elders.",
        fullDescription:
          "Community kitchens serve two hot meals a day, with therapeutic feeding for malnourished infants and monthly food baskets for households in crisis.",
        highlights: ["2 hot meals daily", "Therapeutic infant feeding", "Monthly food baskets"],
        targetGroup: "Children, mothers and elders",
        location: "37 community centers",
        imageUri: img("photo-1488521787991-ed7bbaae773c"),
        metricsAchieved: "1.2M meals served in 2025",
      },
      {
        id: "p3",
        title: "Education & Scholarships",
        categoryTag: "Education",
        shortDescription:
          "School fees, uniforms, tutoring and vocational training pathways.",
        fullDescription:
          "We cover full school costs, run after-school tutoring, and place graduates into vocational programs with partner employers across construction, hospitality and IT.",
        highlights: ["Full school sponsorship", "After-school tutoring", "Vocational placement"],
        targetGroup: "Students aged 6–22",
        location: "Nationwide",
        imageUri: img("photo-1503676260728-1c00da094a0b"),
        metricsAchieved: "2,310 scholarships active",
      },
      {
        id: "p4",
        title: "Mobile Healthcare",
        categoryTag: "Healthcare",
        shortDescription:
          "Clinics on wheels reaching rural districts with no health post.",
        fullDescription:
          "Two mobile clinics deliver vaccination, maternal check-ups, chronic-illness follow-up and emergency referrals to remote kebeles on a fixed monthly rotation.",
        highlights: ["Vaccination drives", "Maternal check-ups", "Emergency referrals"],
        targetGroup: "Rural families",
        location: "Oromia · SNNPR",
        imageUri: img("photo-1576091160399-112ba8d25d1d"),
        metricsAchieved: "48,000 consultations",
      },
    ],
  },
  impact: {
    sectionTitle: "Our impact in numbers",
    sectionSubtitle:
      "Independently audited figures from the 2025 annual transparency report.",
    stats: [
      { id: "i1", metricNumber: "18,420", metricValue: 18420, label: "Children supported", description: "Since inception in 2014" },
      { id: "i2", metricNumber: "1.2M", metricValue: 1200000, label: "Meals served", description: "In 2025 alone" },
      { id: "i3", metricNumber: "2,310", metricValue: 2310, label: "Active scholarships", description: "Primary to university" },
      { id: "i4", metricNumber: "94", metricValue: 94, label: "Program efficiency", suffix: "%", description: "Of every birr reaches the field" },
    ],
    trend: [
      { period: "Jan", beneficiaries: 5400, meals: 82000 },
      { period: "Feb", beneficiaries: 5900, meals: 88000 },
      { period: "Mar", beneficiaries: 6300, meals: 94000 },
      { period: "Apr", beneficiaries: 6800, meals: 101000 },
      { period: "May", beneficiaries: 7200, meals: 108000 },
      { period: "Jun", beneficiaries: 7900, meals: 116000 },
      { period: "Jul", beneficiaries: 8400, meals: 121000 },
      { period: "Aug", beneficiaries: 8800, meals: 127000 },
      { period: "Sep", beneficiaries: 9300, meals: 133000 },
      { period: "Oct", beneficiaries: 9900, meals: 140000 },
      { period: "Nov", beneficiaries: 10400, meals: 147000 },
      { period: "Dec", beneficiaries: 11200, meals: 156000 },
    ],
    stories: [
      {
        id: "st1",
        beneficiaryName: "Selam, 14",
        quote: "I used to sleep near the bus terminal. Now I am second in my class.",
        story:
          "Selam arrived at our Addis shelter in 2022. Two years later she is on a full scholarship and mentors younger residents in the reading program.",
        imageUri: img("photo-1517841905240-472988babdf9", 800, 800),
        metricNumber: "2,310",
        metricLabel: "Students like Selam",
      },
      {
        id: "st2",
        beneficiaryName: "Abebe, 9",
        quote: "The doctors came to our village. My mother did not have to walk 20km.",
        story:
          "Abebe's family lives four hours from the nearest clinic. Our mobile unit now visits his kebele every month.",
        imageUri: img("photo-1503454537195-1dcabb73ffb9", 800, 800),
        metricNumber: "48,000",
        metricLabel: "Consultations delivered",
      },
      {
        id: "st3",
        beneficiaryName: "W/ro Almaz, 71",
        quote: "Someone remembers us. That is worth more than the food.",
        story:
          "Almaz receives a monthly food basket and weekly home visits through our elder-care companion program.",
        imageUri: img("photo-1544005313-94ddf0286df2", 800, 800),
        metricNumber: "1,180",
        metricLabel: "Elders in care",
      },
    ],
  },
  gallery: {
    sectionTitle: "From the field",
    sectionSubtitle: "Moments from our centers, clinics and community drives.",
    items: [
      { id: "g1", title: "Reading hour", categoryTag: "Education", mediaUri: img("photo-1503676260728-1c00da094a0b"), isVideo: false },
      { id: "g2", title: "New dormitory opening", categoryTag: "Shelter", mediaUri: img("photo-1518495973542-4542c06a5843"), isVideo: false },
      { id: "g3", title: "Vaccination drive", categoryTag: "Healthcare", mediaUri: img("photo-1576091160399-112ba8d25d1d"), isVideo: false },
      { id: "g4", title: "Annual fundraising gala", categoryTag: "Events", mediaUri: img("photo-1511578314322-379afb476865"), isVideo: false },
      { id: "g5", title: "Community kitchen", categoryTag: "General", mediaUri: img("photo-1488521787991-ed7bbaae773c"), isVideo: false },
      { id: "g6", title: "Graduation day", categoryTag: "Education", mediaUri: img("photo-1523050854058-8df90110c9f1"), isVideo: false },
      { id: "g7", title: "Field story film", categoryTag: "General", mediaUri: "https://www.youtube.com/embed/ysz5S6PUM-U", thumbnailUri: img("photo-1509099836639-18ba1795216d"), isVideo: true },
      { id: "g8", title: "Winter blanket distribution", categoryTag: "Shelter", mediaUri: img("photo-1497486751825-1233686d5d80"), isVideo: false },
    ],
  },
  events: {
    sectionTitle: "Events & news",
    sectionSubtitle: "Join a drive, a fundraiser, or a volunteer day.",
    homepageBadge: "Featured events",
    homepageSectionTitle: "Featured moments worth a look",
    events: [
      {
        id: "e1",
        title: "Winter Blanket Drive",
        date: "2026-09-12",
        timeLocation: "9:00 AM · Meskel Square, Addis Ababa",
        description: "Help us pack and distribute 4,000 blankets before the cold season.",
        organizerTag: "Community Team",
        imageUri: img("photo-1497486751825-1233686d5d80"),
        rsvpHref: "#rsvp",
      },
      {
        id: "e2",
        title: "Annual Transparency Report Launch",
        date: "2026-10-02",
        timeLocation: "2:00 PM · Hilton Addis",
        description: "Public presentation of audited financials and program outcomes.",
        organizerTag: "Governance",
        imageUri: img("photo-1511578314322-379afb476865"),
      },
      {
        id: "e3",
        title: "Back-to-School Sponsorship Day",
        date: "2026-11-08",
        timeLocation: "10:00 AM · Adama Center",
        description: "Sponsor a student's full year of school materials in one sitting.",
        organizerTag: "Education",
        imageUri: img("photo-1503676260728-1c00da094a0b"),
      },
      {
        id: "e4",
        title: "Mobile Clinic Milestone: 48,000 Consultations",
        date: "2026-06-21",
        timeLocation: "Oromia region",
        description: "Our two mobile units crossed 48,000 lifetime patient consultations.",
        organizerTag: "Healthcare",
        isPast: true,
        imageUri: img("photo-1576091160399-112ba8d25d1d"),
      },
    ],
  },
  footer: {
    orgName: "Link4Good Charitable Organization",
    registrationNumber: "ACSO Reg. No. 4127/2016",
    missionStatement:
      "Linking generous people to children and elders who need shelter, food, health and education.",
    address: "Bole Sub-city, Woreda 03, Addis Ababa, Ethiopia",
    phone: "+251 911 000 000",
    phones: ["+251 911 000 000"],
    email: "hello@link4good.org",
    bankAccounts: [
      { id: "cbe", bankName: "Commercial Bank of Ethiopia", accountName: "Link4Good Charitable Organization", accountNumber: "1000234567891", swiftCode: "CBETETAA" },
      { id: "telebirr", bankName: "Telebirr Merchant", accountName: "Link4Good", accountNumber: "451209" },
      { id: "boa", bankName: "Bank of Abyssinia", accountName: "Link4Good Charitable Organization", accountNumber: "128745690023", swiftCode: "ABYSETAA" },
      { id: "awash", bankName: "Awash Bank", accountName: "Link4Good Charitable Organization", accountNumber: "013301122334455", swiftCode: "AWINETAA" },
    ],
    quickLinks: [
      { label: "Our mission", href: "/about" },
      { label: "Programs", href: "/programs" },
      { label: "Impact", href: "/impact" },
      { label: "Gallery", href: "/gallery" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Safeguarding", href: "/safeguarding" },
    ],
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      telegram: "https://t.me",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
    },
  },
  about: {
    sectionTitle: "Our story",
    foundingNarrative:
      "Link4Good began as a small community effort to shelter children living on the streets of Addis Ababa. It grew into a multi-service nonprofit focused on care, dignity, and measurable local impact.",
    imageUri: img("photo-1509099836639-18ba1795216d"),
    charterVerified: true,
    registrationNumber: "4127/2016",
    timeline: [
      { id: "t1", year: "2014", title: "First shelter opened", description: "Three emergency beds for children at risk." },
      { id: "t2", year: "2018", title: "Nutrition network expanded", description: "Community kitchens launched in three districts." },
      { id: "t3", year: "2022", title: "Mobile clinics launched", description: "First rural outreach program reached 12 kebeles." },
    ],
  },
  mission: {
    sectionTitle: "What we stand for",
    missionStatement:
      "We connect communities, donors and local institutions to protect children, support elders and create practical pathways to stability.",
    visionStatement:
      "A community where no child is forgotten, no elder is left behind, and every family has a path to stability and hope.",
    pillars: [
      { id: "m1", title: "Safety", description: "Safe shelter, trauma-informed care and case management.", icon: "shield" },
      { id: "m2", title: "Nutrition", description: "Meals and food support with dignity and consistency.", icon: "nutrition" },
      { id: "m3", title: "Education", description: "Access to school, tutoring and long-term opportunity.", icon: "book" },
    ],
  },
  contact: {
    sectionTitle: "Contact the Link4Good team",
    address: "Bole Sub-city, Woreda 03, Addis Ababa, Ethiopia",
    phones: ["+251 911 000 000"],
    email: "hello@link4good.org",
    mapEmbedUrl: "https://www.google.com/maps?q=Addis%20Ababa%2C%20Ethiopia&output=embed",
    officeHours: "Mon–Sat · 8:00 AM–6:00 PM",
  },
  volunteer: {
    sectionTitle: "Volunteer with us",
    sectionSubtitle: "Choose a pillar, share your skills, and help us make the next care cycle possible.",
    servicePillars: [
      { id: "vp1", title: "Caregiving", description: "Direct support for children, elders and family care." },
      { id: "vp2", title: "Professional support", description: "Skills sharing, admin help and strategy support." },
      { id: "vp3", title: "Community outreach", description: "Campaigns, events and fundraiser logistics." },
    ],
    skillOptions: ["Teaching", "Healthcare", "Community outreach", "Photography", "Administration", "Counselling"],
    availabilityOptions: ["Weekdays", "Weekends", "Evenings", "One-off events"],
  },
};

/**
 * Single source of truth for every organization-specific string, figure,
 * link and image URL on the site. To reuse this template for a different
 * organization, this file (plus donationContent.ts) is the only file that
 * needs to change.
 *
 * The type below is inferred from the literal above rather than hand-written
 * against src/types/schema.ts. Several sections (navbar, hero, about,
 * mission, contact) are still shaped to satisfy the generic interfaces in
 * schema.ts, since the swappable "variable" section renderers are typed
 * against those interfaces — so field names there (e.g. `subHeadline`,
 * `backgroundMedia`) must be kept in sync with schema.ts. Other sections
 * (programs, impact, gallery, events, footer, volunteer, admin, seo) are
 * consumed directly and only need to stay internally consistent.
 */
export type OrgContent = typeof orgContent;

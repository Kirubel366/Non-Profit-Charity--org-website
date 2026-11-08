const img = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const orgContent = {
  /** Branding shown across the admin console (OCMS) and its login screen. */
  admin: {
    productName: "Addis Hiwot OCMS",
    demoAdminDisplayName: "Addis Hiwot Administrator",
    financeEmail: "2002addishiwot@gmail.com",
    supportEmail: "2002addishiwot@gmail.com",
  },
  /** Fallback SEO metadata used by routes that don't define their own. */
  seo: {
    siteName: "Addis Hiwot Charity Association",
    defaultTitle: "Addis Hiwot Charity Association — New Life Through Health & Education",
    defaultDescription:
      "Addis Hiwot Charity Association is a non-profit founded in 2010 at the University of Gondar. Over 500 members support people in need through healthcare, education, youth empowerment and community support.",
  },
  navbar: {
    logoUrl: "/images/addis-hiwot/logo.jpg",
    orgName: "Addis Hiwot",
    tagline: "Charity Association",
    emergencyPhone: "+251 91 830 0057",
    email: "2002addishiwot@gmail.com",
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
      accountName: "Addis Hiowt Charity Organization",
      accountNumber: "1000095074147",
      swiftCode: "To be confirmed",
    },
    primaryAction: { label: "Donate Now", modal: "donation" },
    secondaryAction: { label: "Volunteer", modal: "volunteer" },
  },
  hero: {
    eyebrow: "Founded 2010 · University of Gondar · Registered with the Civil Society Organizations Authority",
    headline: "Giving people in need a new life through health and education",
    subHeadline:
      "Addis Hiwot Charity Association began with students who saved a classmate's life. Today over 500 members, including doctors, engineers, teachers, lawyers and students, carry that spirit forward.",
    primaryCtaLabel: "Donate Now",
    secondaryCtaLabel: "Our Story",
    trustBadges: [
      "Serving since 2010",
      "500+ professional members",
      "Health · Education · Community",
    ],
    badges: [
      { label: "Members", value: "500+" },
      { label: "Blood donors mobilized", value: "800+" },
      { label: "Patients helped abroad", value: "7" },
    ],
    backgroundMedia: [
      { id: "s1", mediaUri: "/images/addis-hiwot/gena-christmas.jpg", caption: "Celebrating Christmas (Gena) with neighbors in need in Gondar" },
      { id: "s2", mediaUri: "/images/addis-hiwot/youth-center.jpg", caption: "Building the Youth Center at the University of Gondar" },
      { id: "s3", mediaUri: "/images/addis-hiwot/anniversary.jpg", caption: "Members and University of Gondar officials at our anniversary" },
    ],
    videoUri: "", // TODO: no video provided yet
    // MOCK DATA: replace with a real campaign or remove before launch
    activeCampaign: {
      title: "Help us build Addis Hiwot Village",
      targetAmount: 500000,
      raisedAmount: 185000,
      donorCount: 62,
      currencySymbol: "ETB",
      deadline: "2026-12-31",
    },
  },
  programs: {
    sectionTitle: "What we do",
    sectionSubtitle:
      "Four areas of work, carried out by our members and partners.",
    programs: [
      {
        id: "p1",
        title: "Healthcare Support",
        categoryTag: "Healthcare",
        shortDescription:
          "Helping patients who cannot afford treatment and mobilizing blood donors.",
        fullDescription:
          "By 2016 we had helped seven people who could not be treated in Ethiopia reach care abroad, through fundraising and by connecting them with specialist doctors. We also run blood donation campaigns with the Gondar Blood Bank across the University of Gondar campuses. In 2016 our anniversary campaign collected 379 units of blood in two days, and the Blood Bank recognized our coordination.",
        highlights: ["Patient fundraising", "Specialist referrals", "Blood donation campaigns"],
        targetGroup: "Patients who cannot afford care",
        location: "Gondar",
        imageUri: "/images/addis-hiwot/blood-donation.jpg",
        metricsAchieved: "800+ blood donors · 379 units in one campaign · 7 patients helped abroad",
      },
      {
        id: "p2",
        title: "Educational Support",
        categoryTag: "Education",
        shortDescription:
          "Exam tutoring, counselling and support for vulnerable children.",
        fullDescription:
          "We believe education is the backbone of development. We run tutorial classes for 8th, 10th and 12th grade students preparing for national exams, and offer psychological guidance to students facing personal challenges. We also support children from low-income families, with financial help, tutoring, counselling and guardians who follow their progress. On weekends they get a safe place to wash and stay clean, a healthy lunch on Saturdays and Sundays, homework help from volunteer university students, and donated clothes, shoes and school supplies.",
        highlights: ["Grade 8, 10 and 12 tutorials", "Psychological support", "Weekend meals, tutoring and supplies for children"],
        targetGroup: "Students and vulnerable children",
        location: "Gondar",
        imageUri: "/images/addis-hiwot/anniversary.jpg",
        metricsAchieved: "Weekend meals, tutoring and school supplies for children from low-income families",
      },
      {
        id: "p3",
        title: "Youth Empowerment",
        categoryTag: "Youth",
        shortDescription:
          "A student-designed and student-built Youth Center at the University of Gondar.",
        fullDescription:
          "The Addis Hiwot Youth Center was designed by senior architecture students and built by senior civil engineering students, with support from the University of Gondar. It includes reading areas with Wi-Fi, book rental and audio-visual services, game zones (tennis, badminton, table tennis, pool, darts), a martial arts and fitness center, coffee ceremony spaces for poetry nights and welcome events, and green areas. The Youth Center also hosts income-generating ventures that fund our charitable work: a pool house, a restaurant, Adis traditional jebena coffee and the Adis Gojo book rental.",
        highlights: ["Student-designed and built", "Study, sports and fitness spaces", "Income that funds our charity work"],
        targetGroup: "University students",
        location: "University of Gondar",
        imageUri: "/images/addis-hiwot/youth-center.jpg",
        metricsAchieved: "Designed and built by students from several departments",
      },
      {
        id: "p4",
        title: "Community Support",
        categoryTag: "Community",
        shortDescription:
          "Clothing drives and holiday celebrations for neighbors in need.",
        fullDescription:
          "We organize clothing donation drives where donated clothes are washed, mended and distributed to those in need. Every Christmas (Gena) we celebrate with 400 to 500 people in need, and at Easter 2026 we gave food, clothing and shoes to 200 elderly people, people with disabilities and children.",
        highlights: ["Clothing donation drives", "Christmas (Gena) celebration", "Easter food, clothing and shoes"],
        targetGroup: "Neighbors in need",
        location: "Gondar",
        imageUri: "/images/addis-hiwot/gena-christmas.jpg",
        metricsAchieved: "400+ people at Gena · 200 people at Easter 2026",
      },
    ],
  },
  impact: {
    sectionTitle: "Our impact in numbers",
    sectionSubtitle:
      "Key figures from our activities since 2010.",
    stats: [
      { id: "i1", metricNumber: "500", metricValue: 500, suffix: "+", label: "Members", description: "Doctors, engineers, teachers, lawyers and students" },
      { id: "i2", metricNumber: "800", metricValue: 800, suffix: "+", label: "Blood donors", description: "Mobilized through campaigns with the Red Cross" },
      { id: "i3", metricNumber: "400", metricValue: 400, suffix: "+", label: "Gena guests", description: "People in need we celebrate Christmas with each year" },
      { id: "i4", metricNumber: "7", metricValue: 7, label: "Patients helped abroad", description: "People who could not be treated in Ethiopia (as of 2016)" },
    ],
    // MOCK DATA: replace with real monthly figures before launch
    // (the chart labels the second series "meals", so the numbers can be treated as any second measure for now)
    trend: [
      { period: "Jan", beneficiaries: 34, meals: 120 },
      { period: "Feb", beneficiaries: 41, meals: 135 },
      { period: "Mar", beneficiaries: 48, meals: 150 },
      { period: "Apr", beneficiaries: 55, meals: 168 },
      { period: "May", beneficiaries: 63, meals: 180 },
      { period: "Jun", beneficiaries: 70, meals: 196 },
      { period: "Jul", beneficiaries: 76, meals: 210 },
      { period: "Aug", beneficiaries: 84, meals: 226 },
      { period: "Sep", beneficiaries: 91, meals: 240 },
      { period: "Oct", beneficiaries: 99, meals: 258 },
      { period: "Nov", beneficiaries: 108, meals: 275 },
      { period: "Dec", beneficiaries: 117, meals: 294 },
    ],
    // Stories come from the charity's own Facebook posts. Children are not named on purpose.
    // The "Our sister" quote is her life philosophy as shared in the charity's post (translated from Amharic).
    stories: [
      {
        id: "st1",
        beneficiaryName: "Hiwot Girma",
        quote: "",
        story:
          "In 2010 Hiwot, a 21-year-old nursing student, needed treatment abroad. Medical students at the University of Gondar raised 100,000 ETB in 10 days, and the university added 30,000 ETB. She received a stem cell transplant in Bangkok. After saving her life, 20 medical students founded Addis Hiwot, named in her honor.",
        imageUri: "/images/addis-hiwot/logo.jpg",
        metricNumber: "100,000",
        metricLabel: "ETB raised in 10 days",
      },
      {
        id: "st2",
        beneficiaryName: "A young woman from rural Ethiopia",
        quote: "You will find the key from the Creator that people hid from you.",
        story:
          "After a childhood fall broke her leg and local treatment failed, she spent more than four years mostly confined at home. She came to Gondar to study and asked the University of Gondar Students' Union for help. Together with Addis Hiwot, the university's former president and an orthopedic specialist, we connected her with Australian Doctors for Africa, who operated in Addis Ababa. A year later she walked without crutches and returned to school, and in 2018 she was studying sociology at the University of Gondar.",
        imageUri: "/images/addis-hiwot/logo.jpg",
        metricNumber: "4+",
        metricLabel: "years waiting for treatment",
      },
      {
        id: "st3",
        beneficiaryName: "Arsema Kasaw",
        quote: "",
        story:
          "Arsema, a 19-year-old second-year TVET student in road construction, needed a kidney transplant abroad that she could not afford. Addis Hiwot called on the community to unite and help, and she flew to New Delhi for her transplant.",
        imageUri: "/images/addis-hiwot/logo.jpg",
        metricNumber: "New Delhi",
        metricLabel: "transplant treatment abroad",
      },
      {
        id: "st4",
        beneficiaryName: "Haymanot",
        quote: "",
        story:
          "Haymanot, a member of the Addis Hiwot family, was successfully treated in India in 2016. The association thanked the University of Gondar's senior officials for their continued support.",
        imageUri: "/images/addis-hiwot/logo.jpg",
        metricNumber: "India",
        metricLabel: "treated successfully",
      },
    ],
  },
  gallery: {
    sectionTitle: "From the field",
    sectionSubtitle: "Moments from our campaigns, celebrations and Youth Center.",
    items: [
      { id: "g1", title: "Christmas (Gena) with neighbors in need", categoryTag: "Community", mediaUri: "/images/addis-hiwot/gena-christmas.jpg", isVideo: false },
      { id: "g2", title: "Building the Youth Center", categoryTag: "Youth", mediaUri: "/images/addis-hiwot/youth-center.jpg", isVideo: false },
      { id: "g3", title: "Blood donation campaign", categoryTag: "Healthcare", mediaUri: "/images/addis-hiwot/blood-donation.jpg", isVideo: false },
      { id: "g4", title: "Anniversary with University of Gondar officials", categoryTag: "Events", mediaUri: "/images/addis-hiwot/anniversary.jpg", isVideo: false },
    ] as {
      id: string;
      title: string;
      categoryTag: string;
      mediaUri: string;
      isVideo: boolean;
      thumbnailUri?: string;
    }[],
  },
  events: {
    sectionTitle: "Events & news",
    sectionSubtitle: "Join a drive, a celebration, or a volunteer day.",
    homepageBadge: "Featured events",
    homepageSectionTitle: "Featured moments worth a look",
    events: [
      {
        id: "e1",
        title: "Blood Donation Campaign",
        date: "2026-11-07",
        timeLocation: "Time to be confirmed · Tewodros Campus, University of Gondar",
        description: "Join our blood donation campaign at the University of Gondar. One donation can help save a patient's life.",
        organizerTag: "Addis Hiwot",
        imageUri: "/images/addis-hiwot/blood-donation.jpg",
        rsvpHref: "#rsvp",
      },
      {
        id: "e2",
        title: "Youth Support Evening Discussion",
        date: "2026-10-23", // 13/02/2019 EC (Tikimt 13)
        timeLocation: "Evening · Tewodros Campus, University of Gondar, in front of the Veterinary Library",
        description: "An evening discussion on how we can support young people with their education and basic needs.",
        organizerTag: "Addis Hiwot",
        imageUri: "/images/addis-hiwot/anniversary.jpg",
        isPast: true,
      },
      {
        id: "e3",
        title: "Easter Celebration with 200 Neighbors in Need",
        date: "2026-04-12", // TODO: the Facebook post's date conversion is inconsistent (Apr 12 to 20, 2026). Easter (Fasika) 2026 was Apr 12. Confirm with the charity.
        timeLocation: "Gondar Cultural Center (Cinema Hall), Gondar",
        description: "For Easter 2018 E.C., we gave food, clothing and shoes to 200 low-income elderly people, people with disabilities and children, and celebrated the holiday together.",
        organizerTag: "Addis Hiwot",
        imageUri: "/images/addis-hiwot/gena-christmas.jpg",
        isPast: true,
      },
      {
        id: "e4",
        title: "Christmas (Gena) Celebration at Meskel Square",
        date: "2020-01-07",
        timeLocation: "Meskel Square",
        description: "Our 11th Christmas celebration, hosting about 400 to 500 people in need.",
        organizerTag: "Addis Hiwot",
        imageUri: "/images/addis-hiwot/gena-christmas.jpg",
        isPast: true,
      },
      {
        id: "e5",
        title: "International Blood Donor Day: Recognized by the Gondar Blood Bank",
        date: "2016-06-25",
        timeLocation: "From 8:30 AM · Gondar Cinema Hall",
        description: "More than 300 members of institutions and associations gathered for panel discussions, entertainment and lunch. Addis Hiwot was among the first award recipients, receiving three certificates of recognition for coordinating blood collection on the Atse Fasil, Atse Tewodros and Maraki campuses.",
        organizerTag: "Addis Hiwot",
        imageUri: "/images/addis-hiwot/blood-donation.jpg",
        isPast: true,
      },
      {
        id: "e6",
        title: "Sixth Anniversary Blood Donation Campaign: 379 Units Collected",
        date: "2016-05-21", // approximate: a post dated May 23, 2016 says the campaign ran over the past two days
        timeLocation: "Two days · Atse Fasil, Atse Tewodros and Maraki campuses, University of Gondar",
        description: "With the Gondar Blood Bank, our members collected 379 units of blood over two days to mark our sixth anniversary.",
        organizerTag: "Addis Hiwot",
        imageUri: "/images/addis-hiwot/blood-donation.jpg",
        isPast: true,
      },
    ] as {
      id: string;
      title: string;
      date: string;
      timeLocation: string;
      description: string;
      organizerTag: string;
      imageUri: string;
      rsvpHref?: string;
      isPast?: boolean;
    }[],
  },
  footer: {
    orgName: "Addis Hiwot Charity Association (Tabgha Charitable Organization)",
    registrationNumber: "Registered as Tabgha Charitable Organization", // TODO: add the certificate number
    missionStatement:
      "Empowering people in need through healthcare and education so they can contribute to solving societal problems.",
    address: "Tewodros Campus, University of Gondar, Gondar, Ethiopia",
    phone: "+251 91 830 0057",
    phones: ["+251 91 830 0057", "+251 91 586 1262"],
    email: "2002addishiwot@gmail.com",
    bankAccounts: [
      { id: "cbe", bankName: "Commercial Bank of Ethiopia", accountName: "Addis Hiowt Charity Organization", accountNumber: "1000095074147" },
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
      facebook: "https://web.facebook.com/Addishiwotcharity.org",
      instagram: "#", // placeholder: charity only has Facebook
      telegram: "#", // placeholder
      linkedin: "#", // placeholder
      youtube: "#", // placeholder
    },
  },
  about: {
    sectionTitle: "Our story",
    foundingNarrative:
      "Addis Hiwot Charity Association was founded in May 2010 at the University of Gondar. Medical students there raised 100,000 ETB in 10 days to save the life of Hiwot Girma, a 21-year-old nursing student, and the university added 30,000 ETB. After saving her life, 20 medical students formed the association and named it Addis Hiwot, meaning New Life, in her honor. We are a non-political, non-profit, non-religious and non-racial organization, and we have grown to over 500 members from many professions.",
    imageUri: "/images/addis-hiwot/anniversary.jpg",
    charterVerified: false, // TODO: set to true once the certificate number is added below
    registrationNumber: "0000/0000", // TODO: MOCK number, replace with the real certificate number before launch
    timeline: [
      { id: "t1", year: "2010", title: "Founded at the University of Gondar", description: "Students raised 100,000 ETB in 10 days to save Hiwot Girma, then established Addis Hiwot." },
      { id: "t2", year: "2012", title: "Helping patients reach treatment", description: "A young woman was operated on in Addis Ababa by Australian Doctors for Africa, and a University of Gondar staff member received 26,000 ETB toward surgery in Rome." },
      { id: "t3", year: "2013", title: "Eight days, 51,000 ETB", description: "The university community rallied to cover a student's urgent medical costs." },
      { id: "t4", year: "2016", title: "Recognized by the Gondar Blood Bank", description: "Our sixth anniversary campaign collected 379 units of blood, and we received three certificates of recognition on International Blood Donor Day." },
      { id: "t5", year: "Now", title: "Officially registered", description: "Addis Hiwot is registered with the Civil Society Organizations Authority under the name Tabgha Charitable Organization, so we can reach more communities and plan Addis Hiwot Village." },
    ],
  },
  mission: {
    sectionTitle: "What we stand for",
    missionStatement:
      "To offer opportunities for those in need to empower themselves and contribute to solving societal problems, in a society where every individual has access to healthcare and education.",
    visionStatement:
      "To establish Addis Hiwot Village, with the largest and highest-class referral hospital in Ethiopia offering free medical services to those in need, within a self-sustaining community that supports vulnerable groups through education and healthcare.",
    pillars: [
      { id: "m1", title: "Health", description: "Patient support, blood donation and, one day, a free referral hospital.", icon: "shield" },
      { id: "m2", title: "Education", description: "Tutoring, counselling and support so children and students can grow.", icon: "book" },
      { id: "m3", title: "Community", description: "Youth centers, clothing drives and celebrations that bring people together.", icon: "nutrition" },
    ],
  },
  contact: {
    sectionTitle: "Contact the Addis Hiwot team",
    address: "Tewodros Campus, University of Gondar, Gondar, Ethiopia",
    phones: ["+251 91 830 0057", "+251 91 586 1262"],
    email: "2002addishiwot@gmail.com",
    mapEmbedUrl: "https://www.google.com/maps?q=University%20of%20Gondar%20Tewodros%20Campus%2C%20Gondar%2C%20Ethiopia&output=embed",
    officeHours: "To be confirmed",
  },
  volunteer: {
    sectionTitle: "Join Addis Hiwot",
    sectionSubtitle: "Choose an area, share your skills, and help us reach more people in need.",
    servicePillars: [
      { id: "vp1", title: "Healthcare support", description: "Blood donation drives, patient fundraising and health expertise." },
      { id: "vp2", title: "Education & mentoring", description: "Tutorial classes for grades 8, 10 and 12, and psychosocial support." },
      { id: "vp3", title: "Community outreach", description: "Clothing drives, Gena celebrations and Youth Center activities." },
    ],
    skillOptions: ["Medicine & nursing", "Teaching & tutoring", "Counselling", "Engineering & architecture", "Law", "Administration", "Community outreach"],
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

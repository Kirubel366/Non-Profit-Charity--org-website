/**
 * Master feature toggles. Disabled modules are hidden from the public site
 * (routes redirect home) and from the OCMS admin sidebar.
 */
export const enabledModules = {
  events: true,
  gallery: true,
  volunteers: true,
  donate: true,
  socialFeed: true,
  inquiries: true,
  settings: true,
  ocmsAdmin: true,
} as const;

export type ModuleKey = keyof typeof enabledModules;

export const isModuleEnabled = (key: ModuleKey) => enabledModules[key];

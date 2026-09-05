/** Derives scannable impact bullets from the shared ProgramItem contract. */
export function toBulletPoints(fullDescription: string, max = 3): string[] {
  return fullDescription
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

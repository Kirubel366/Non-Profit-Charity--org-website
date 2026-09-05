/**
 * Storage bucket names, defined once so admin (writer) and public (reader)
 * code can never drift out of sync with each other — that drift is exactly
 * what caused gallery images to render broken (admin wrote to one bucket
 * name/path convention, public code assumed another).
 */
export const GALLERY_BUCKET = "gallery"; // public bucket
export const RECEIPTS_BUCKET = "donation-receipts"; // private bucket
export const RESUMES_BUCKET = "resumes"; // private bucket
export const EVENTS_BUCKET = "events"; // public bucket for event images

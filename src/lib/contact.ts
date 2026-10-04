/** Router state passed along with a contact link so the form can show what is being asked about. */
export type ContactLinkState = { galleryTitle?: string; thumbUrl?: string };

export const contactHref = (galleryId?: string, imageId?: string): string => {
  const params = new URLSearchParams();
  if (galleryId) params.set('album', galleryId);
  if (galleryId && imageId) params.set('image', imageId);
  const q = params.toString();
  return `/contact${q ? `?${q}` : ''}#message`;
};

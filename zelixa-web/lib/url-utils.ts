/**
 * Resolves an image URL based on whether it is an absolute link or a relative path from the storage provider.
 * 
 * @param path The image path or full URL
 * @returns The resolved URL string
 */
export function formatImageUrl(path: string | null | undefined): string {
  if (!path) return '';

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://store.zelixa.my.id';
  const cleanStorageUrl = storageUrl.endsWith('/') ? storageUrl.slice(0, -1) : storageUrl;

  // Handle data URLs directly
  if (path.startsWith('data:')) {
    return path;
  }

  // REPAIR LOGIC: If it contains minio:9000 (even if it's already an absolute URL)
  // replace that part with the public domain.
  if (path.includes('minio:9000')) {
    const parts = path.split('minio:9000');
    if (parts.length > 1) {
      // The part after minio:9000 might already have a slash
      const cleanPath = parts[1].startsWith('/') ? parts[1] : `/${parts[1]}`;
      // Clean up any trailing dots or punctuation that might have been copied in the URL
      const finalPath = cleanPath.replace(/\.$/, '');
      return `${cleanStorageUrl}${finalPath}`;
    }
  }

  // If it's already an absolute public URL (like Google or placeholder), return as is
  if (path.startsWith('http')) {
    return path;
  }

  // Prepend storage URL to relative paths
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanStorageUrl}${cleanPath}`;
}

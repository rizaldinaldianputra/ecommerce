/**
 * Resolves an image URL based on whether it is an absolute link or a relative path from the storage provider.
 * 
 * @param path The image path or full URL
 * @returns The resolved URL string
 */
export function formatImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://storage.zelixa.my.id';
  const cleanStorageUrl = storageUrl.endsWith('/') ? storageUrl.slice(0, -1) : storageUrl;

  // REPAIR LOGIC: If it's an old internal URL from Docker, replace it with public domain
  if (path.includes('minio:9000')) {
    const parts = path.split('minio:9000');
    if (parts.length > 1) {
      return `${cleanStorageUrl}${parts[1]}`;
    }
  }

  // If it's another absolute URL (like Google or placeholder), return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Prepend storage URL to relative paths
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanStorageUrl}${cleanPath}`;
}

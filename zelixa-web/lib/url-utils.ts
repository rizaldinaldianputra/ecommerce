/**
 * Resolves an image URL based on whether it is an absolute link or a relative path from the storage provider.
 * 
 * @param path The image path or full URL
 * @returns The resolved URL string
 */
export function formatImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) {
    return path;
  }
  
  // Prepend storage URL to relative paths
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://storage.zelixa.my.id';
  
  // Ensure we don't have double slashes if the storage URL ends with one or path starts with one
  const cleanStorageUrl = storageUrl.endsWith('/') ? storageUrl.slice(0, -1) : storageUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanStorageUrl}${cleanPath}`;
}

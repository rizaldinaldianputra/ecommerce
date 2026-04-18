/**
 * Resolves an image URL based on whether it is an absolute link or a relative path from the storage provider.
 * 
 * @param path The image path or full URL
 * @returns The resolved URL string
 */
export function formatImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://storage.minio.zelixa.my.id';
  const cleanStorageUrl = storageUrl.endsWith('/') ? storageUrl.slice(0, -1) : storageUrl;

  // REPAIR LOGIC: If it's an old internal URL from Docker (e.g. http://minio:9000/...), 
  // replace the internal part with the public domain.
  if (path.includes('minio:9000')) {
    const parts = path.split('minio:9000');
    if (parts.length > 1) {
      // Clean up any trailing dots or punctuation that might have been copied in the URL
      const cleanPath = parts[1].replace(/\.$/, ''); 
      return `${cleanStorageUrl}${cleanPath}`;
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

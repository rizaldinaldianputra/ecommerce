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

  // REPAIR LOGIC: If it contains internal/local storage endpoints
  const internalEndpoints = ['minio:9000', 'localhost:9000', '127.0.0.1:9000'];
  const matchedEndpoint = internalEndpoints.find(endpoint => path.includes(endpoint));
  
  if (matchedEndpoint) {
    const parts = path.split(matchedEndpoint);
    if (parts.length > 1) {
      let cleanPath = parts[1].startsWith('/') ? parts[1] : `/${parts[1]}`;
      
      // OPTIONAL: Strip bucket name if pointing to production domain
      // If store.zelixa.my.id maps directly to the bucket root
      if (cleanStorageUrl.includes('store.zelixa.my.id')) {
        cleanPath = cleanPath.replace(/^\/(zelixa|shekza-bucket)\//, '/');
      }

      return `${cleanStorageUrl}${cleanPath.replace(/\.$/, '')}`;
    }
  }

  // If it's already an absolute public URL (like Google or placeholder), return as is
  if (path.startsWith('http')) {
    return path;
  }

  // Prepend storage URL to relative paths
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Also strip bucket name from relative paths if in production
  if (cleanStorageUrl.includes('store.zelixa.my.id')) {
    cleanPath = cleanPath.replace(/^\/(zelixa|shekza-bucket)\//, '/');
  }

  return `${cleanStorageUrl}${cleanPath}`;
}

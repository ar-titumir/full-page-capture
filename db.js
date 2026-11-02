export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('full-page-capture', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('captures', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function database(mode, action) {
  const db = await openDB();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('captures', mode);
      const request = action(tx.objectStore('captures'));
      tx.oncomplete = () => resolve(request?.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Storage operation aborted'));
    });
  } finally { db.close(); }
}

export * from './schema';

// Request persistent storage for Safari (prevents 7-day cache eviction)
if ('storage' in navigator && 'persist' in navigator.storage) {
  navigator.storage.persist().then((persistent) => {
    if (persistent) {
      console.log('Storage persistence granted');
    } else {
      console.log('Storage persistence denied');
    }
  }).catch((error) => {
    console.error('Failed to request persistent storage:', error);
  });
}

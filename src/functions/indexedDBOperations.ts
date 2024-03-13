// Function to store ArrayBuffer
export async function storeArrayBuffer(audioBuffer: ArrayBuffer, key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('plotty-database', 1) // Increment the version number

    openRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('audioBuffers')) db.createObjectStore('audioBuffers')
    }

    openRequest.onsuccess = () => {
      const db = (openRequest as IDBOpenDBRequest).result
      const transaction = db.transaction('audioBuffers', 'readwrite')
      const store = transaction.objectStore('audioBuffers')
      const request = store.add(audioBuffer, key)

      request.onsuccess = () => {
        resolve('Successfully stored ArrayBuffer in IndexedDB')
      }

      request.onerror = () => {
        reject(new Error(`Error storing ArrayBuffer: ${request.error}`))
      }
    }

    openRequest.onerror = () => {
      reject(new Error(`Error opening database: ${openRequest.error}`))
    }
  })
}

// Function to read ArrayBuffer
export async function readArrayBuffer(key: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('plotty-database', 1)

    openRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('audioBuffers')) db.createObjectStore('audioBuffers')
    }

    openRequest.onsuccess = (e: Event) => {
      const db = (e.target as IDBOpenDBRequest).result
      const transaction = db.transaction('audioBuffers', 'readonly')
      const store = transaction.objectStore('audioBuffers')

      const request = store.get(key)

      request.onsuccess = () => {
        if (request.result) resolve(request.result)
        else reject(new Error('ArrayBuffer not found'))
      }

      request.onerror = () => {
        reject(new Error(`Error getting ArrayBuffer: ${request.error}`))
      }
    }

    openRequest.onerror = () => {
      reject(new Error(`Error opening database: ${openRequest.error}`))
    }
  })
}

// Function to delete ArrayBuffer
export async function deleteArrayBuffer(key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('plotty-database', 1)

    openRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('audioBuffers')) db.createObjectStore('audioBuffers')
    }

    openRequest.onsuccess = () => {
      const db = (openRequest as IDBOpenDBRequest).result
      const transaction = db.transaction('audioBuffers', 'readwrite')
      const store = transaction.objectStore('audioBuffers')
      const request = store.delete(key)

      request.onsuccess = () => {
        resolve('Successfully deleted ArrayBuffer from IndexedDB')
      }

      request.onerror = () => {
        reject(new Error(`Error deleting ArrayBuffer: ${request.error}`))
      }
    }

    openRequest.onerror = () => {
      reject(new Error(`Error opening database: ${openRequest.error}`))
    }
  })
}

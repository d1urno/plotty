export default function indexedDBOperations(name: 'arrayBuffer') {
  type StoreItem = typeof name extends 'arrayBuffer' ? ArrayBuffer : never

  async function createStore(): Promise<string> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('plotty-database', 1) // Increment the version number

      openRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name)
      }

      openRequest.onsuccess = () => {
        resolve('Successfully created object store')
      }

      openRequest.onerror = () => {
        reject(new Error(`Error opening database: ${openRequest.error}`))
      }
    })
  }

  // Store an item in indexedDB
  async function storeItem(audioBuffer: StoreItem, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('plotty-database', 1) // Increment the version number

      openRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name)
      }

      openRequest.onsuccess = () => {
        const db = (openRequest as IDBOpenDBRequest).result
        const transaction = db.transaction(name, 'readwrite')
        const store = transaction.objectStore(name)
        const request = store.add(audioBuffer, key)

        request.onsuccess = () => {
          resolve(`Successfully stored ${name} in IndexedDB`)
        }

        request.onerror = () => {
          reject(new Error(`Error storing ${name}: ${request.error}`))
        }
      }

      openRequest.onerror = () => {
        reject(new Error(`Error opening database: ${openRequest.error}`))
      }
    })
  }

  // Read an item from indexedDB
  async function readItem(key: string): Promise<StoreItem> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('plotty-database', 1)

      openRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name)
      }

      openRequest.onsuccess = (e: Event) => {
        const db = (e.target as IDBOpenDBRequest).result
        const transaction = db.transaction(name, 'readonly')
        const store = transaction.objectStore(name)

        const request = store.get(key)

        request.onsuccess = () => {
          if (request.result) resolve(request.result)
          else reject(new Error(`${name} not found`))
        }

        request.onerror = () => {
          reject(new Error(`Error getting ${name}: ${request.error}`))
        }
      }

      openRequest.onerror = () => {
        reject(new Error(`Error opening database: ${openRequest.error}`))
      }
    })
  }

  // Delete an item from indexedDB
  async function deleteItem(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('plotty-database', 1)

      openRequest.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db = (e.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name)
      }

      openRequest.onsuccess = () => {
        const db = (openRequest as IDBOpenDBRequest).result
        const transaction = db.transaction(name, 'readwrite')
        const store = transaction.objectStore(name)
        const request = store.delete(key)

        request.onsuccess = () => {
          resolve(`Successfully deleted ${name} from IndexedDB`)
        }

        request.onerror = () => {
          reject(new Error(`Error deleting ${name}: ${request.error}`))
        }
      }

      openRequest.onerror = () => {
        reject(new Error(`Error opening database: ${openRequest.error}`))
      }
    })
  }

  return {
    createStore,
    storeItem,
    readItem,
    deleteItem
  }
}

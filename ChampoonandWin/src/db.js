/**
 * IndexedDB helpers for Memory Gallery
 * Stores photo blobs + metadata persistently
 */

const DB_NAME = 'MemoryGalleryDB'
const DB_VERSION = 2
const STORE_PHOTOS = 'photos'
const STORE_META = 'meta'

export function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        const store = db.createObjectStore(STORE_PHOTOS, { keyPath: 'id', autoIncrement: true })
        store.createIndex('uploadedAt', 'uploadedAt')
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function dbGetAll(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PHOTOS, 'readonly')
    const req = tx.objectStore(STORE_PHOTOS).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function dbAdd(db, record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PHOTOS, 'readwrite')
    const req = tx.objectStore(STORE_PHOTOS).add(record)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function dbPut(db, record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PHOTOS, 'readwrite')
    const req = tx.objectStore(STORE_PHOTOS).put(record)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function dbDelete(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PHOTOS, 'readwrite')
    const req = tx.objectStore(STORE_PHOTOS).delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export function dbGetMeta(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_META, 'readonly')
    const req = tx.objectStore(STORE_META).get(key)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function dbSetMeta(db, key, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_META, 'readwrite')
    const req = tx.objectStore(STORE_META).put(value, key)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

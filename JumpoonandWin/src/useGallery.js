/**
 * Composable: useGallery
 * Central state + logic for the memory gallery
 */

import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { openDB, dbGetAll, dbAdd, dbPut, dbDelete, dbGetMeta, dbSetMeta } from './db.js'

export function useGallery() {
  let db = null

  // ── Couple names ──────────────────────────────────────────────
  const coupleNames = reactive({ partner1: 'Jumpoon', partner2: 'Win' })
  const editingNames = ref(false)
  const editNames = reactive({ partner1: '', partner2: '' })

  function startEditNames() {
    editNames.partner1 = coupleNames.partner1
    editNames.partner2 = coupleNames.partner2
    editingNames.value = true
  }

  async function saveNames() {
    if (!editNames.partner1.trim() || !editNames.partner2.trim()) return
    coupleNames.partner1 = editNames.partner1.trim()
    coupleNames.partner2 = editNames.partner2.trim()
    editingNames.value = false
    if (db) await dbSetMeta(db, 'coupleNames', { ...coupleNames })
  }

  function cancelEditNames() {
    editingNames.value = false
  }

  // ── Photos ────────────────────────────────────────────────────
  const photos = ref([])
  const loading = ref(true)

  // ── Upload state ──────────────────────────────────────────────
  const dragOver = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadCurrent = ref(0)
  const uploadTotal = ref(0)

  // ── Computed ──────────────────────────────────────────────────
  const earliestDate = computed(() => {
    if (!photos.value.length) return ''
    const ts = photos.value.map((p) => new Date(p.uploadedAt).getTime())
    return formatDate(new Date(Math.min(...ts)).toISOString())
  })

  // ── Helpers ───────────────────────────────────────────────────
  function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  function blobToAspectRatio(blob) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = () => { URL.revokeObjectURL(url); resolve(img.width / img.height) }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
      img.src = url
    })
  }

  function defaultTitle(file) {
    const base = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
    return base.charAt(0).toUpperCase() + base.slice(1)
  }

  // ── Load from DB ──────────────────────────────────────────────
  async function loadFromDB() {
    loading.value = true
    try {
      db = await openDB()

      const savedNames = await dbGetMeta(db, 'coupleNames')
      if (savedNames) {
        coupleNames.partner1 = savedNames.partner1
        coupleNames.partner2 = savedNames.partner2
      }

      const rows = await dbGetAll(db)
      rows.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      rows.forEach((r) => { r.objectUrl = r.blob ? URL.createObjectURL(r.blob) : null })
      photos.value = rows
    } catch (err) {
      console.error('DB load error:', err)
    }
    loading.value = false
  }

  // ── Upload ────────────────────────────────────────────────────
  async function processFiles(files) {
    if (!files || !files.length) return
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!arr.length) return

    uploading.value = true
    uploadTotal.value = arr.length
    uploadCurrent.value = 0
    uploadProgress.value = 0

    const newPhotos = []

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i]
      uploadCurrent.value = i + 1

      const aspect = await blobToAspectRatio(file)
      const record = {
        title: defaultTitle(file),
        uploadedAt: new Date().toISOString(),
        blob: file,
        aspectRatio: aspect,
      }

      if (db) {
        const id = await dbAdd(db, record)
        record.id = id
        record.objectUrl = URL.createObjectURL(file)
        newPhotos.push(record)
      }

      uploadProgress.value = Math.round(((i + 1) / arr.length) * 100)
    }

    photos.value.unshift(...newPhotos.reverse())

    await new Promise((r) => setTimeout(r, 400))
    uploading.value = false
    uploadProgress.value = 0
  }

  // ── Edit photo title ──────────────────────────────────────────
  async function updatePhotoTitle(photo, newTitle) {
    const title = newTitle.trim()
    if (!title) return
    photo.title = title
    if (db) {
      const record = { ...photo }
      delete record.objectUrl
      await dbPut(db, record)
    }
  }

  // ── Delete photo ──────────────────────────────────────────────
  async function deletePhoto(photo) {
    if (photo.objectUrl) URL.revokeObjectURL(photo.objectUrl)
    const idx = photos.value.findIndex((p) => p.id === photo.id)
    if (idx !== -1) photos.value.splice(idx, 1)
    if (db && photo.id) await dbDelete(db, photo.id)
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  onMounted(loadFromDB)
  onUnmounted(() => {
    photos.value.forEach((p) => { if (p.objectUrl) URL.revokeObjectURL(p.objectUrl) })
  })

  return {
    // names
    coupleNames, editingNames, editNames,
    startEditNames, saveNames, cancelEditNames,
    // photos
    photos, loading, earliestDate,
    // upload
    dragOver, uploading, uploadProgress, uploadCurrent, uploadTotal,
    processFiles,
    // actions
    updatePhotoTitle, deletePhoto,
    // utils
    formatDate,
  }
}

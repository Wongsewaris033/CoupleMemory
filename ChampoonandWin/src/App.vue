<script setup>
/**
 * App.vue — Root component, wires all pieces together via useGallery composable
 */
import { reactive, ref } from 'vue'
import { useGallery } from './useGallery.js'

import PetalBackground from './components/PetalBackground.vue'
import AppHeader from './components/AppHeader.vue'
import UploadArea from './components/UploadArea.vue'
import GalleryGrid from './components/GalleryGrid.vue'
import EditModal from './components/EditModal.vue'
import DeleteModal from './components/DeleteModal.vue'
import AppFooter from './components/AppFooter.vue'

const {
  coupleNames, editingNames, editNames,
  startEditNames, saveNames, cancelEditNames,
  photos, loading, earliestDate,
  dragOver, uploading, uploadProgress, uploadCurrent, uploadTotal,
  processFiles,
  updatePhotoTitle, deletePhoto,
  formatDate,
} = useGallery()

// ── Edit modal state ───────────────────────────────────────────
const editModal = reactive({ open: false, photo: null })

function openEdit(photo) {
  editModal.photo = photo
  editModal.open = true
}
function closeEdit() {
  editModal.open = false
  editModal.photo = null
}
async function handleSaveEdit(newTitle) {
  if (editModal.photo) await updatePhotoTitle(editModal.photo, newTitle)
  closeEdit()
}

// ── Delete modal state ─────────────────────────────────────────
const deleteModal = reactive({ open: false, photo: null })

function openDelete(photo) {
  deleteModal.photo = photo
  deleteModal.open = true
}
function closeDelete() {
  deleteModal.open = false
  deleteModal.photo = null
}
async function handleConfirmDelete() {
  if (deleteModal.photo) await deletePhoto(deleteModal.photo)
  closeDelete()
}
</script>

<template>
  <!-- Floating petals background -->
  <PetalBackground />

  <div class="relative z-10">

    <!-- Header / Hero -->
    <AppHeader
      :coupleNames="coupleNames"
      :editingNames="editingNames"
      :editNames="editNames"
      :photoCount="photos.length"
      :earliestDate="earliestDate"
      @startEdit="startEditNames"
      @saveNames="saveNames"
      @cancelEdit="cancelEditNames"
      @update:editNames="Object.assign(editNames, $event)"
    />

    <!-- Upload zone -->
    <UploadArea
      :dragOver="dragOver"
      :uploading="uploading"
      :uploadProgress="uploadProgress"
      :uploadCurrent="uploadCurrent"
      :uploadTotal="uploadTotal"
      @files="processFiles"
      @dragover="dragOver = true"
      @dragleave="dragOver = false"
    />

    <!-- Photo gallery -->
    <GalleryGrid
      :photos="photos"
      :loading="loading"
      :formatDate="formatDate"
      @edit="openEdit"
      @delete="openDelete"
    />

    <!-- Footer -->
    <AppFooter />

  </div>

  <!-- Edit title modal -->
  <EditModal
    :open="editModal.open"
    :photo="editModal.photo"
    @close="closeEdit"
    @save="handleSaveEdit"
  />

  <!-- Delete confirmation modal -->
  <DeleteModal
    :open="deleteModal.open"
    :photo="deleteModal.photo"
    :formatDate="formatDate"
    @close="closeDelete"
    @confirm="handleConfirmDelete"
  />
</template>

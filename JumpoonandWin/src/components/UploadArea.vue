<script setup>
/**
 * UploadArea — Drag & drop / click-to-upload zone with progress bar
 */
const props = defineProps({
  dragOver: { type: Boolean, default: false },
  uploading: { type: Boolean, default: false },
  uploadProgress: { type: Number, default: 0 },
  uploadCurrent: { type: Number, default: 0 },
  uploadTotal: { type: Number, default: 0 },
})

const emit = defineEmits(['files', 'dragover', 'dragleave'])

function handleDrop(e) {
  emit('dragleave')
  emit('files', e.dataTransfer.files)
}

function handleFileSelect(e) {
  emit('files', e.target.files)
  e.target.value = ''
}
</script>

<template>
  <section class="max-w-3xl mx-auto px-4 mt-8 mb-2" aria-label="Upload photos">
    <div
      class="upload-zone rounded-3xl p-8 text-center relative"
      :class="{ 'drag-over': dragOver }"
      @dragover.prevent="$emit('dragover')"
      @dragleave="$emit('dragleave')"
      @drop.prevent="handleDrop"
      role="region"
      aria-label="Drag and drop upload area"
    >
      <!-- Hidden file input covers the whole zone -->
      <input
        type="file"
        multiple
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        @change="handleFileSelect"
        aria-label="Choose photos to upload"
      />

      <!-- Zone content -->
      <div class="pointer-events-none select-none">
        <div class="text-5xl mb-3">🌼</div>
        <p class="text-lg font-semibold" style="color:#c0708a;font-family:'Playfair Display',serif;">
          Drop your memories here
        </p>
        <p class="text-sm mt-1" style="color:#d09aaa;">
          or <span class="underline" style="color:#e05585;">click anywhere</span> to browse
        </p>
        <p class="text-xs mt-2" style="color:#d0aab8;">Supports multiple images at once</p>
      </div>

      <!-- Upload progress -->
      <div v-if="uploading" class="mt-4 pointer-events-none">
        <div class="h-1 rounded-full overflow-hidden" style="background:rgba(240,160,180,0.2);">
          <div class="upload-bar" :style="`width:${uploadProgress}%`"></div>
        </div>
        <p class="text-xs mt-2" style="color:#d09aaa;">
          Saving {{ uploadCurrent }} of {{ uploadTotal }}…
        </p>
      </div>
    </div>
  </section>
</template>

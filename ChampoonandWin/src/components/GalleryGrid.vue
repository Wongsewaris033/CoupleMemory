<script setup>
/**
 * GalleryGrid — Masonry layout with empty state and loading skeleton
 */
import PhotoCard from './PhotoCard.vue'

defineProps({
  photos: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  formatDate: { type: Function, required: true },
})

const emit = defineEmits(['edit', 'delete', 'preview'])
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 pb-16 mt-10" role="main">

    <!-- Section title -->
    <div class="section-title-line mb-8">
      <h2
        class="display text-2xl font-semibold whitespace-nowrap px-4"
        style="color:#b5536a;"
      >
        🌸 Our Memories
      </h2>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && photos.length === 0" class="empty-state py-16 text-center">
      <div class="text-7xl mb-4 select-none">🌼</div>
      <h3 class="display text-2xl mb-2" style="color:#c0708a;">Your gallery is waiting</h3>
      <p class="text-base max-w-xs mx-auto" style="color:#d0aab8;line-height:1.7;">
        Start creating beautiful memories together. Upload your first photo above ✨
      </p>
      <div class="mt-6 flex justify-center gap-2 text-2xl select-none" aria-hidden="true">
        <span>🌸</span><span>💕</span><span>🌼</span><span>✨</span><span>🌸</span>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="masonry-grid">
      <div
        v-for="i in 6"
        :key="i"
        class="photo-card mb-4 animate-pulse"
        style="height:220px;background:rgba(255,200,215,0.2);"
      ></div>
    </div>

    <!-- Masonry photo grid -->
    <div v-if="!loading && photos.length > 0" class="masonry-grid" role="list">
      <PhotoCard
        v-for="photo in photos"
        :key="photo.id"
        :photo="photo"
        :formatDate="formatDate"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @preview="$emit('preview', $event)"
      />
    </div>

  </main>
</template>
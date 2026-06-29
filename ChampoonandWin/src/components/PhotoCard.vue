<script setup>
/**
 * PhotoCard — Single memory card with uniform image size + preview on click
 */
defineProps({
  photo: { type: Object, required: true },
  formatDate: { type: Function, required: true },
})

const emit = defineEmits(['edit', 'delete', 'preview'])
</script>

<template>
  <article class="photo-card" role="listitem" :aria-label="photo.title">

    <!-- Image — fixed square crop, click to preview -->
    <div
      class="img-wrapper"
      @click="$emit('preview', photo)"
      role="button"
      tabindex="0"
      :aria-label="`Preview ${photo.title}`"
      @keydown.enter="$emit('preview', photo)"
      @keydown.space.prevent="$emit('preview', photo)"
    >
      <img
        :src="photo.objectUrl"
        :alt="photo.title"
        loading="lazy"
        class="lazy-loaded"
      />
      <div class="preview-overlay">
        <span class="preview-icon">🔍</span>
      </div>
    </div>

    <!-- Card body -->
    <div class="p-3">

      <!-- Title -->
      <p
        class="text-sm font-semibold leading-snug mb-1"
        style="color:#7a3048;font-family:'Playfair Display',serif;"
        :title="photo.title"
      >
        {{ photo.title }}
      </p>

      <!-- Date chip -->
      <div class="mb-2">
        <span class="date-chip">{{ formatDate(photo.uploadedAt) }}</span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click.stop="$emit('edit', photo)"
          class="btn-ghost text-xs px-3 py-1.5 flex-1"
          :aria-label="`Edit title of ${photo.title}`"
        >
          ✏️ Edit
        </button>
        <button
          @click.stop="$emit('delete', photo)"
          class="text-xs px-3 py-1.5 rounded-full font-semibold flex-1 transition-all duration-200 delete-btn"
          :aria-label="`Delete ${photo.title}`"
        >
          🗑️ Delete
        </button>
      </div>

    </div>
  </article>
</template>

<style scoped>
.img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255,220,228,0.15);
}

.img-wrapper img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.photo-card:hover .img-wrapper img {
  transform: scale(1.05);
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(60, 10, 25, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s ease;
}

.img-wrapper:hover .preview-overlay {
  background: rgba(60, 10, 25, 0.28);
}

.preview-icon {
  font-size: 1.8rem;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.2s ease, transform 0.2s ease;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
}

.img-wrapper:hover .preview-icon {
  opacity: 1;
  transform: scale(1);
}

.delete-btn {
  background: rgba(255,220,224,0.5);
  color: #c0505a;
  border: 1.5px solid rgba(240,160,170,0.4);
}
.delete-btn:hover {
  background: rgba(255,180,190,0.6);
}
</style>
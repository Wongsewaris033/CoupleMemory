<script setup>
/**
 * PhotoCard — Single memory card with image, title, date, and actions
 */
defineProps({
  photo: { type: Object, required: true },
  formatDate: { type: Function, required: true },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <article class="photo-card" role="listitem" :aria-label="photo.title">

    <!-- Image -->
    <div class="overflow-hidden" style="max-height:340px;">
      <img
        :src="photo.objectUrl"
        :alt="photo.title"
        loading="lazy"
        class="w-full lazy-loaded"
        :style="`aspect-ratio:${photo.aspectRatio || 'auto'};max-height:340px;`"
      />
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
          @click="$emit('edit', photo)"
          class="btn-ghost text-xs px-3 py-1.5 flex-1"
          :aria-label="`Edit title of ${photo.title}`"
        >
          ✏️ Edit
        </button>
        <button
          @click="$emit('delete', photo)"
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
.delete-btn {
  background: rgba(255,220,224,0.5);
  color: #c0505a;
  border: 1.5px solid rgba(240,160,170,0.4);
}
.delete-btn:hover {
  background: rgba(255,180,190,0.6);
}
</style>

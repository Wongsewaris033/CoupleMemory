<script setup>
/**
 * DeleteModal — Confirmation dialog before removing a memory
 */
defineProps({
  open: { type: Boolean, default: false },
  photo: { type: Object, default: null },
  formatDate: { type: Function, required: true },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-backdrop"
      @click.self="$emit('close')"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete"
    >
      <div class="modal-box">

        <div class="text-center mb-4">
          <span class="text-3xl select-none">🗑️</span>
          <h3 class="display text-xl font-semibold mt-1" style="color:#b5536a;">
            Remove this memory?
          </h3>
        </div>

        <!-- Photo preview row -->
        <div
          v-if="photo"
          class="flex gap-3 items-center mb-5 p-3 rounded-2xl"
          style="background:rgba(255,235,240,0.5);"
        >
          <img
            :src="photo.objectUrl"
            alt=""
            style="width:80px;height:80px;object-fit:cover;border-radius:0.75rem;flex-shrink:0;"
          />
          <div>
            <p class="font-semibold text-sm" style="color:#7a3048;">{{ photo.title }}</p>
            <p class="text-xs mt-0.5" style="color:#c09aaa;">{{ formatDate(photo.uploadedAt) }}</p>
          </div>
        </div>

        <p class="text-sm text-center mb-5" style="color:#c09aaa;">
          This will permanently remove the photo from your gallery.
        </p>

        <div class="flex gap-3">
          <button
            @click="$emit('confirm')"
            class="flex-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 confirm-delete-btn"
          >
            Yes, remove it
          </button>
          <button @click="$emit('close')" class="btn-ghost flex-1 px-5 py-2.5 text-sm">
            Keep it
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-delete-btn {
  background: linear-gradient(135deg, #f87171, #dc2626);
  color: white;
  box-shadow: 0 4px 14px rgba(220,38,38,0.3);
}
.confirm-delete-btn:hover {
  box-shadow: 0 8px 20px rgba(220,38,38,0.4);
  transform: translateY(-1px);
}
</style>

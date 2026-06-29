<script setup>
/**
 * PreviewModal — Full-size image lightbox
 */
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  photo: { type: Object, default: null },
})

const emit = defineEmits(['close'])

function handleKey(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))

// Lock body scroll when open
watch(() => props.photo, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="preview-fade">
      <div
        v-if="photo"
        class="preview-backdrop"
        @click.self="$emit('close')"
        role="dialog"
        aria-modal="true"
        :aria-label="`Preview: ${photo?.title}`"
      >

        <!-- Close button -->
        <button
          class="preview-close"
          @click="$emit('close')"
          aria-label="Close preview"
        >
          ✕
        </button>

        <!-- Image container -->
        <div class="preview-container" @click.stop>
          <img
            :src="photo.objectUrl"
            :alt="photo.title"
            class="preview-img"
          />
          <!-- Caption -->
          <div class="preview-caption">
            <span class="preview-title">{{ photo.title }}</span>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.preview-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(20, 5, 12, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.preview-close {
  position: fixed;
  top: 1.2rem;
  right: 1.4rem;
  z-index: 101;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 240, 244, 0.9);
  color: #7a3048;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  transition: background 0.2s, transform 0.2s;
}
.preview-close:hover {
  background: #fff;
  transform: scale(1.1);
}

.preview-container {
  position: relative;
  max-width: min(90vw, 1000px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5);
}

.preview-img {
  display: block;
  max-width: 100%;
  max-height: calc(90vh - 3.5rem);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 1.2rem 1.2rem 0 0;
}

.preview-caption {
  width: 100%;
  background: rgba(255, 245, 248, 0.97);
  padding: 0.65rem 1.2rem;
  border-radius: 0 0 1.2rem 1.2rem;
}

.preview-title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  color: #7a3048;
  font-weight: 600;
}

/* Transition */
.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.22s ease;
}
.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}
.preview-fade-enter-active .preview-container,
.preview-fade-leave-active .preview-container {
  transition: transform 0.22s cubic-bezier(.34,1.56,.64,1);
}
.preview-fade-enter-from .preview-container {
  transform: scale(0.9);
}
.preview-fade-leave-to .preview-container {
  transform: scale(0.95);
}
</style>

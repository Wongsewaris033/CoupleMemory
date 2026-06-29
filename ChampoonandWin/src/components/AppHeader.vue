<script setup>
/**
 * AppHeader — Hero section with couple names, stats, and decorations
 */
import { computed } from 'vue'

const props = defineProps({
  coupleNames: { type: Object, required: true },
  editingNames: { type: Boolean, default: false },
  editNames: { type: Object, required: true },
  photoCount: { type: Number, default: 0 },
  earliestDate: { type: String, default: '' },
})

const emit = defineEmits(['startEdit', 'saveNames', 'cancelEdit', 'update:editNames'])

const localEdit = computed({
  get: () => props.editNames,
  set: (val) => emit('update:editNames', val),
})

function onKeyEnter() {
  emit('saveNames')
}
</script>

<template>
  <header class="hero-bg py-10 px-4" role="banner">
    <div class="max-w-3xl mx-auto text-center">

      <!-- Daisy decoration row -->
      <div class="flex justify-center gap-3 mb-4 text-2xl select-none" aria-hidden="true">
        <span class="daisy-float" style="animation-delay:0s">🌼</span>
        <span class="daisy-float" style="animation-delay:0.5s">✨</span>
        <span class="daisy-float" style="animation-delay:1s">🌸</span>
        <span class="daisy-float" style="animation-delay:1.5s">✨</span>
        <span class="daisy-float" style="animation-delay:2s">🌼</span>
      </div>

      <!-- Display mode -->
      <div v-if="!editingNames" class="mb-3">
        <h1
          class="couple-title display"
          style="font-size:clamp(2rem,6vw,3.8rem);color:#b5536a;letter-spacing:-0.02em;line-height:1.1;"
          aria-label="Couple names"
        >
          {{ coupleNames.partner1 }}
          <span class="heart-pulse">❤️</span>
          {{ coupleNames.partner2 }}
        </h1>
        <button
          @click="$emit('startEdit')"
          class="mt-3 btn-ghost text-sm px-4 py-1.5 inline-flex items-center gap-1.5"
          aria-label="Edit couple names"
        >
          ✏️ Edit names
        </button>
      </div>

      <!-- Edit mode -->
      <div v-else class="mb-3">
        <div class="flex items-center gap-3 flex-wrap justify-center mb-3">
          <input
            :value="editNames.partner1"
            @input="$emit('update:editNames', { ...editNames, partner1: $event.target.value })"
            class="couple-name-input"
            placeholder="Name 1"
            aria-label="Partner 1 name"
            maxlength="30"
            @keyup.enter="$emit('saveNames')"
          />
          <span class="heart-pulse text-4xl">❤️</span>
          <input
            :value="editNames.partner2"
            @input="$emit('update:editNames', { ...editNames, partner2: $event.target.value })"
            class="couple-name-input"
            placeholder="Name 2"
            aria-label="Partner 2 name"
            maxlength="30"
            @keyup.enter="$emit('saveNames')"
          />
        </div>
        <div class="flex gap-3 justify-center">
          <button @click="$emit('saveNames')" class="btn-rose px-6 py-2 text-sm">Save ✓</button>
          <button @click="$emit('cancelEdit')" class="btn-ghost px-5 py-2 text-sm">Cancel</button>
        </div>
      </div>

      <p class="text-base" style="color:#c0708a;font-family:'Lato',sans-serif;letter-spacing:0.04em;">
        A private little world, just for us 🌸
      </p>

      <!-- Stats pills -->
      <div class="mt-5 flex justify-center gap-3 flex-wrap">
        <span class="stats-pill">
          📷 {{ photoCount }} {{ photoCount === 1 ? 'memory' : 'memories' }}
        </span>
        <span v-if="photoCount > 0 && earliestDate" class="stats-pill">
          🗓️ Since {{ earliestDate }}
        </span>
      </div>

    </div>
  </header>
</template>

<style scoped>
.hero-bg {
  background: linear-gradient(160deg, #fff5f7 0%, #fff8f0 40%, #f0f4eb 100%);
  border-bottom: 1px solid rgba(255,182,193,0.3);
}
</style>

<script setup>
/**
 * PetalBackground — Randomly floating petals/flowers in the background
 */
import { ref } from 'vue'

const PETAL_CHARS = ['🌸', '🌼', '🌷', '✨', '💮', '🍃', '💕']

const petals = ref(
  Array.from({ length: 18 }, (_, i) => ({
    id: i,
    char: PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)],
    left: Math.random() * 100,
    dur: 10 + Math.random() * 14,
    delay: -(Math.random() * 20),
    size: 0.9 + Math.random() * 0.8,
  }))
)
</script>

<template>
  <div class="petal-bg" aria-hidden="true">
    <span
      v-for="p in petals"
      :key="p.id"
      class="petal"
      :style="`left:${p.left}%;animation-duration:${p.dur}s;animation-delay:${p.delay}s;font-size:${p.size}rem;`"
    >{{ p.char }}</span>
  </div>
</template>

<script setup>
/**
 * EditModal — Modal to rename a photo memory
 */
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  photo: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const newTitle = ref('')
const inputRef = ref(null)

// Populate title when modal opens
watch(
  () => props.open,
  async (val) => {
    if (val && props.photo) {
      newTitle.value = props.photo.title
      await nextTick()
      inputRef.value?.focus()
    }
  }
)

function handleSave() {
  if (!newTitle.value.trim()) return
  emit('save', newTitle.value.trim())
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-backdrop"
      @click.self="$emit('close')"
      role="dialog"
      aria-modal="true"
      aria-label="Edit photo title"
    >
      <div class="modal-box">

        <div class="text-center mb-4">
          <span class="text-3xl select-none">✏️</span>
          <h3 class="display text-xl font-semibold mt-1" style="color:#b5536a;">
            Edit Memory Title
          </h3>
        </div>

        <img
          v-if="photo"
          :src="photo.objectUrl"
          alt=""
          class="w-full rounded-2xl mb-4"
          style="max-height:200px;object-fit:cover;"
        />

        <label class="block text-sm font-semibold mb-2" style="color:#9a4060;">
          Memory title
        </label>
        <input
          ref="inputRef"
          v-model="newTitle"
          class="input-soft"
          placeholder="Give this memory a name…"
          maxlength="80"
          @keyup.enter="handleSave"
        />

        <div class="flex gap-3 mt-5">
          <button @click="handleSave" class="btn-rose px-6 py-2.5 text-sm flex-1">
            Save changes
          </button>
          <button @click="$emit('close')" class="btn-ghost px-5 py-2.5 text-sm flex-1">
            Cancel
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<template>
  <div class="limited-textarea relative w-full">
    <textarea
      v-model="localValue"
      :rows="rows"
      :maxlength="maxlength || undefined"
      :disabled="disabled"
      v-bind="attrs"
      :class="['w-full resize-y', textareaClass]"
    />

    <div v-if="showCounter" class="char-counter absolute right-2 bottom-2 text-xs text-muted">{{ remaining }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAttrs } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  maxlength: { type: Number, default: 0 },
  rows: { type: Number, default: 4 },
  disabled: { type: Boolean, default: false },
  textareaClass: { type: [String, Array, Object], default: '' },
})

const emit = defineEmits(['update:modelValue', 'input'])

const attrs = useAttrs()

const localValue = ref(String(props.modelValue ?? ''))

watch(
  () => props.modelValue,
  (v) => {
    if (v !== localValue.value) localValue.value = String(v ?? '')
  }
)

watch(localValue, (v) => {
  emit('update:modelValue', v)
  emit('input', v)
})

const showCounter = computed(() => Number(props.maxlength) > 0)
const remaining = computed(() => (props.maxlength ? Math.max(0, props.maxlength - String(localValue.value).length) : 0))
</script>

<style scoped>
.limited-textarea .char-counter {
  color: var(--muted);
  pointer-events: none;
}

/* make room for the counter so it doesn't overlap textarea content */
.limited-textarea textarea,
.limited-textarea .u-textarea textarea {
  padding-right: 3rem !important;
  width: 100%;
    padding: .6rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    resize: vertical;
    background: var(--input-bg);
    color: inherit;
}

.limited-textarea .text-muted { color: var(--muted) }
</style>

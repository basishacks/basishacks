<template>
  <div class="limited-input relative w-full">
    <UInput
      v-model="localValue"
      :type="type"
      :maxlength="maxlength || undefined"
      :disabled="disabled"
      v-bind="attrs"
      :class="['w-full', inputClass]"
    />

    <div v-if="showCounter" class="char-counter absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted">{{ remaining }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAttrs } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  maxlength: { type: Number, default: 0 },
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false },
  inputClass: { type: [String, Array, Object], default: '' },
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
.limited-input .char-counter {
  color: var(--muted);
  pointer-events: none;
}

/* ensure there is space on the right of the input text so the counter doesn't overlap */
.limited-input .u-input,
.limited-input input {
  padding-right: 2.5rem !important;
}
</style>

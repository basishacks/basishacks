<template>
  <div v-if="visible" class="notification-banner" :style="bannerStyle" role="region" :aria-label="ariaLabel">
      <div class="notif-icon" aria-hidden="true">
        <slot name="icon">
          <span v-if="iconHtml" v-html="iconHtml"></span>
          <span v-else class="notif-default-icon">ℹ️</span>
        </slot>
      </div>
      <div class="notif-body">
        <slot name="title">
          <div v-if="titleHtml" class="notif-title" v-html="titleHtml"></div>
        </slot>
        <slot name="body">
          <div v-if="bodyHtml" class="notif-desc" v-html="bodyHtml"></div>
        </slot>
      </div>
    <button v-if="closable" class="notif-close" @click="$emit('close')" aria-label="Close notification">✕</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: true },
  bgLight: { type: String, default: '' },
  bgDark: { type: String, default: '' },
  titleHtml: { type: String, default: '' },
  bodyHtml: { type: String, default: '' },
  iconHtml: { type: String, default: '' },
  closable: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'notification' }
})

// detect dark mode heuristically on client
const isDark = (typeof document !== 'undefined') && (
  document.documentElement.classList.contains('dark') ||
  document.documentElement.getAttribute('data-theme') === 'dark' ||
  document.documentElement.dataset.colorMode === 'dark'
)

const bannerStyle = computed(() => {
  const bg = isDark ? (props.bgDark || props.bgLight) : (props.bgLight || props.bgDark)
  return bg ? { background: bg, borderColor: 'transparent' } : {}
})

const emit = defineEmits(['close'])
</script>

<style scoped>
.notification-banner {
  display: flex;
  align-items: flex-start;
  gap: .6rem;
  padding: .6rem .8rem;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 0.8rem;
  box-shadow: var(--panel-shadow);
  background: var(--notif-bg);
}
.notification-banner .notif-icon { flex: 0 0 36px; display:flex; align-items:center; justify-content:center; font-size:18px }
.notification-banner .notif-body { flex: 1 1 auto }
.notification-banner .notif-title { font-weight:700; margin-bottom: .15rem }
.notification-banner .notif-desc { color: var(--muted-2); font-size: .95rem }
</style>

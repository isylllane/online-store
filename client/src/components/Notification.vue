<template>
  <v-snackbar
      v-model="isVisible"
      :color="notification.color"
      location="top"
      timeout="3000"
  >
    {{ notification.message }}
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/store/notification'

const notification = useNotificationStore()

const isVisible = computed({
  get: () => notification.show,
  set: (value) => {
    if (!value) notification.hide()
  }
})
</script>
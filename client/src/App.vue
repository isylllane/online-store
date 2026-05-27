<template>
  <v-app>
    <Navbar />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <Notification />
  </v-app>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Notification from '@/components/Notification.vue'
</script>
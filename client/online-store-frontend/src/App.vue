<template>
  <v-app>
    <v-main>
      <router-view />
      {{text}}
    </v-main>
  </v-app>
</template>

<script setup>
  const text = "Hello World!";
</script>

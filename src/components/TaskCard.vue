<template>
  <div class="h-1/4 w-1/5 bg-cardBg shadow-md rounded-md p-4">
    <h3>{{ task.title }}</h3>
    <p>{{ task.description }}</p>
    <p>{{ task.start }}</p>
    <p>{{ task.end }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
 task: {
   type: Object,
   required: true
 }
})



</script>

<style>

</style>
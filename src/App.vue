<template>
  <Calendar :first-day-of-week="0" mode="week" :max-date="new Date(2024, 6, 5)" />
  <Calendar :first-day-of-week="0" mode="month" />
  <Test />
</template>

<script setup lang="ts">
import Calendar from './components/calendar/calendar.vue';
import Test from './components/test.vue';

</script>

<style scoped>
</style>

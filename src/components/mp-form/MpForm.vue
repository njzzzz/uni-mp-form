<script setup lang="ts">
import type { PropType } from 'vue'
import { defineFormSchema } from './useForm'

const props = defineProps({
  schema: {
    type: Object as PropType<Parameters<typeof defineFormSchema>['0']>,
    default: () => ({}),
  },
})
</script>

<template>
  <uni-forms>
    <uni-forms-item />
  </uni-forms>
</template>

<style scoped lang="scss">

</style>

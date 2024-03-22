<script setup lang="ts" generic="T extends Record<string, any>">
import { type PropType, computed } from 'vue'
import type { FormKeys, FormSchema } from './useForm'

const props = defineProps({
  schema: {
    type: Object as PropType<FormSchema<T>>,
    default: () => ({}),
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const emits = defineEmits(['update:model-value'])
// form属性，排除config，config为无效属性
const formProps = computed(() => {
  const { config: _, ...schema } = props.schema
  return schema
})
// 表单配置
const config = computed(() => props.schema.config)
// 转换配置为数组
const list = computed(() => {
  const keys = Object.keys(config.value) as FormKeys<T>[]
  return keys.map((k) => {
    return {
      ...config.value[k],
      name: k,
      slots: config.value[k].slots,
    }
  })
})
// 更新modelValue
function update(name: string, v: any) {
  emits('update:model-value', { ...props.modelValue, [name]: v })
}
</script>

<template>
  <uni-forms
    :model-value="modelValue"
    v-bind="formProps"
  >
    <uni-forms-item
      v-for="item in list"
      :key="item.name"
      v-bind="item"
    >
      <template #default>
        <template v-if="item.slots?.default && !item.hidden">
          {{ item.slots.default(item) }}
        </template>
        <component
          :is="item.widget"
          v-else-if="!item.hidden"
          v-show="item.visible"
          v-bind="item.widgetProps"
          :model-value="modelValue[item.name]"
          :config="item"
          @update:model-value=" update(item.name, $event)"
        />
      </template>
      <template
        v-if="item.slots?.label"
        #label
      >
        {{ item.slots.label(item) }}
      </template>
    </uni-forms-item>
  </uni-forms>
</template>

<style scoped lang="scss">

</style>

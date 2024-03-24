<script setup lang="ts" generic="T extends Record<string, any>">
/**
 * @description 由于uni-app 不支持component is 动态组件所以使用加载所有模版的方式获取组件
 */
import { type PropType, type Ref, computed } from 'vue'
import { ref, toRefs, watch } from 'vue'
import type { FormKeys, FormSchema, WidgetPropsInFormItem } from './type'
import { updateValue, useDependOn } from './useForm'
import ComponentImport from './Component.vue'

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
const emits = defineEmits(['update:model-value', 'update:schema'])
// 这个是必有的，避免后面使用 runtimeSchema.value!直接使用as推断
const runtimeSchema = ref() as Ref<FormSchema<T>>

watch(
  () => props.schema,
  (v) => {
    runtimeSchema.value = v
    // 不接受深度监听，只允许修改引用地址触发更新
  },
  { immediate: true },
)

// form属性，排除config，config为无效属性
const formProps = computed(() => {
  const { config: _, ...schema } = runtimeSchema.value
  return schema
})
// 表单配置
const config = computed(() => runtimeSchema.value.config)

// 转换配置为数组
const list = computed(() => {
  const keys = Object.keys(config.value) as FormKeys<T>[]
  return keys.map((k) => {
    const item = config.value[k]
    const widgetPropsInFormItem: Record<WidgetPropsInFormItem, boolean> = {
      clearable: item.clearable ?? true,
      disabled: item.disabled ?? false,
      readonly: item.readonly ?? false,
    }
    // symbol设置为false则不展示 优先级 item > form
    const globalSymbol = formProps.value.symbol ?? ':'
    const symbol = item.symbol === false ? '' : item.symbol ?? globalSymbol
    return {
      ...item,
      name: k,
      slots: item.slots,
      symbol,
      widget: item.widget ?? 'uni-easyinput',
      cache: item.cache !== undefined ? item.cache : formProps.value.cache ?? false,
      widgetProps: {
        // 自己定义在widgetProps中的属性优先级更高
        ...item.widgetProps,
        ...widgetPropsInFormItem,
      },
    }
  })
})
const { modelValue: model } = toRefs(props)

// 处理dependOn相关逻辑
useDependOn(
  model as Ref<T>,
  list.value,
  runtimeSchema.value.config,
  onConfigUpdated,
  onValueUpdated,
)
// 更新modelValue
function update(name: string, v: any, hidden: boolean) {
  updateValue({
    model: props.modelValue,
    onValueUpdated,
    values: [v],
    name,
    hidden,
  })
}

// 更新mapKeys Value
function updateMapKeys(mapKeys: string[], values: any[], hidden: boolean) {
  updateValue({
    model: props.modelValue,
    onValueUpdated,
    mapKeys,
    values,
    hidden,
  })
}

// 更新schema
function onConfigUpdated() {
  emits('update:schema', runtimeSchema.value)
}
// 更新schema
function onValueUpdated(v: Ref<T>) {
  emits('update:model-value', v)
}
</script>

<template>
  <uni-forms :model-value="modelValue" v-bind="formProps">
    <template v-for="item in list" :key="item.name">
      <uni-forms-item
        v-if="!item.hidden"
        v-show="!item.visible"
        :key="item.name"
        v-bind="item"
      >
        <!--
          uniapp 动态slot支持不完美，无法传递参数
          <slot
          v-if="item.selfWidget"
          :name="item.selfWidget"
          :model-value="modelValue[item.name]"
          :config="item"
          :update-model-value="(v:any) => update(item.name, v)"
          :update-map-keys="(v:any) => updateMapKeys(item.mapKeys ?? [], v)"
        /> -->
        <ComponentImport
          :widget="item.widget"
          v-bind="item.widgetProps"
          :model-value="modelValue[item.name]"
          :config="item"
          :update-model-value="(v:any) => update(item.name, v, !!item.hidden)"
          :update-map-keys="(v:any) => updateMapKeys(item.mapKeys ?? [], v, !!item.hidden)"
        />
      </uni-forms-item>
    </template>
  </uni-forms>
  <view />
</template>

<style scoped lang="scss">
.hidden {
  visibility: hidden;
}
.visible {
  visibility: visible;
}
</style>

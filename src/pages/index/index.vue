<script setup lang="ts">
import { ref } from 'vue'
import type { UnwrapRef } from 'vue'
import {
  defineFormSchema,
} from '@/components/UniConfigForm/useForm'
import { NUP, type PickModel } from '@/components/UniConfigForm/type'
import UniConfigForm from '@/components/UniConfigForm/UniConfigForm.vue'

/**
 * usage
 */
const model = ref({
  name: '',
  age: '',
  x: '',
})
/**
 * 增加这两个类型可获得类型提示
 */
type Model = typeof model
type PickDep<T extends keyof UnwrapRef<Model>> = PickModel<Model, T>

const schema = defineFormSchema<Model>({
  labelPosition: 'left',
  config: {
    name: {
      widget: 'uni-easyinput',
      label: '姓名',
      dependOn: [
        'age',
        {
          age: {
            changeConfig: (config) => {
              return config
            },
          },
        },
      ],
      changeConfig(config, deps: PickDep<'age' | 'x'>) {
        config.hidden = deps.age === '1'
        return config
      },
      changeValue(deps: PickDep<'age' | 'x'>) {
        return deps.age === '1' ? ['xxxxxx'] : [NUP]
      },
    },
    age: {
      dependOn: ['name'],
      widget: 'uni-countdown',
      label: '年龄',
      required: true,
      changeConfig(config) {
        return config
      },
    },
    x: {
      widget: 'uni-combox',
      dependOn: ['x'],
      label: 'x',
      changeConfig(config) {
        return config
      },
    },
  },
})
</script>

<template>
  <view class="content">
    <UniConfigForm v-model="model" v-model:schema="schema" />
  </view>
</template>

<style>
.content {
  padding: 20px;
}
</style>

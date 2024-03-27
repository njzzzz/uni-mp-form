<script setup lang="ts">
import { ref } from 'vue'
import {
  defineFormSchema,
} from '@uni-config-form/vue3/use-form'
import { NUP, type PickModel } from '@uni-config-form/vue3/type'
import UniConfigForm from '@uni-config-form/vue3/uni-config-form.vue'

/**
 * usage
 */
interface IModel {
  name: string
  age: string
  x: string
}
const model = ref<IModel>({
  name: '',
  age: '',
  x: '',
})
/**
 * 增加这两个类型可获得类型提示
 */
type PickDep<T extends keyof IModel> = PickModel<IModel, T>

const schema = defineFormSchema<IModel>({
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

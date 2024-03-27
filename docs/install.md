# 安装

此版本为typescript vue3版本

::: code-group

```npm
$ npm add -S @uni-config-form/vue3
```

```pnpm
$ pnpm add -S @uni-config-form/vue3
```

```yarn
$ yarn add -D @uni-config-form/vue3
```

:::

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  defineFormSchema,
} from '@uni-config-form/vue3/use-form'
import { NUP, type PickModel } from '@uni-config-form/vue3/type'
import UniConfigForm from '@uni-config-form/vue3/uni-config-form.vue'
// 定义表单数据类型
interface IModel {
  name: string
  age: string
  x: string
}
// 初始化表单数据
const model = ref<IModel>({
  name: '',
  age: '',
  x: '',
})
// 增加这两个类型可获得类型提示，主要用户后续获取deps类型
type PickDep<T extends keyof IModel> = PickModel<IModel, T>
// 定义表单schema
const schema = defineFormSchema<IModel>({
  labelPosition: 'left',
  config: {
    name: {
      widget: 'uni-easyinput',
      label: '姓名',
      // 当前表单依赖age表单项，当age发生变动时，会触发changeConfig、changeValue
      dependOn: ['age'],
      changeConfig(config, deps: PickDep<'age' | 'x'>) {
        // 当年龄为1会隐藏当前项
        config.hidden = deps.age === '1'
        // 此处要返回修改后的config
        return config
      },
      changeValue(deps: PickDep<'age' | 'x'>) {
        // 此处要返回修改后的值，这里uni-ui里面的表单组件都只抛出了一个值，所以只要返回一个包含一项的数组，如果不想更新name的值则返回NUP
        return deps.age === '1' ? ['xxxxxx'] : [NUP]
      },
    },
    age: {
      dependOn: ['name'],
      widget: 'uni-easyinput',
      label: '年龄',
      required: true,
      changeConfig(config) {
        return config
      },
    },
    x: {
      widget: 'uni-easyinput',
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
```

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Widget } from '@uni-config-form/vue3/type'

defineProps({
  widget: {
    type: String as PropType<Widget>,
    default: 'uni-easyinput',
  },
  modelValue: String,
  updateModelValue: Function,
  updateMapKeys: Function,

})
/**
 * 如果想自定义组件，因为uni的静态编译，最好自己fork一份，修改下面的组件类型为自己的组件，然后在type.ts中修改Widget类型为自己的即可
 * 如果自定义组件抛出多个值，只需要抛出`update:map-keys`这个事件即可，抛出的值类型为数组，按照自定义的mapKeys定义的顺序放值即可
 * 正常的值使用表单name的值使用 `update:model-value` 抛出即可
 */
</script>

<template>
  <uni-calendar v-if="widget === 'uni-calendar'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-combox v-else-if="widget === 'uni-combox'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-countdown v-else-if="widget === 'uni-countdown'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-data-checkbox v-else-if="widget === 'uni-data-checkbox'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-data-picker v-else-if="widget === 'uni-data-picker'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-data-select v-else-if="widget === 'uni-data-select'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-dateformat v-else-if="widget === 'uni-dateformat'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-datetime-picker v-else-if="widget === 'uni-datetime-picker'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-easyinput v-else-if="widget === 'uni-easyinput'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-fav v-else-if="widget === 'uni-fav'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-file-picker v-else-if="widget === 'uni-file-picker'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-group v-else-if="widget === 'uni-group'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-icons v-else-if="widget === 'uni-icons'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-indexed-list v-else-if="widget === 'uni-indexed-list'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-link v-else-if="widget === 'uni-link'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-number-box v-else-if="widget === 'uni-number-box'" v-bind="$attrs" @update:model-value="updateModelValue" />
  <uni-rate v-else-if="widget === 'uni-rate'" v-bind="$attrs" @update:model-value="updateModelValue" />
</template>

<style scoped lang="scss"></style>

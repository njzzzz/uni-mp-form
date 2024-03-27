import { type MaybeRef, type Ref, readonly, unref, watch } from 'vue'

import {
  type ChangeFn,
  type FormItem,
  type FormKeys,
  type FormSchema,
  NUP,
} from '@uni-config-form/vue3/type'
/**
 * @description 处理dependOn的行为，dependOn修改时需要触发 changeConfig 和 changeValue
 */
export function useDependOn<T extends Record<string, any>>(
  model: Ref<T>,
  list: (FormItem<FormKeys<T>> & { name: FormKeys<T> })[],
  runtimeConfig: FormSchema<T>['config'],
  onConfigUpdated: (config: FormSchema<T>['config']) => void,
  onValueUpdated: (modelValue: Ref<T>) => void,
) {
  for (let index = 0; index < list.length; index++) {
    const item = list[index]
    const {
      changeConfig,
      changeValue,
      dependOn = [],
      mapKeys = [],
      name,
    } = item
    const deps = Array.isArray(dependOn) ? dependOn : [dependOn]
    if (!deps.length)
      return
    const { strDeps, objDeps } = deps.reduce(
      (
        acc: { strDeps: FormKeys<T>[], objDeps: ChangeFn<FormKeys<T>>[] },
        dep,
      ) => {
        // 影响当前项配置的changeConfig 和 changeValue
        if (typeof dep === 'string')
          acc.strDeps.push(dep)
        // 对象配置，影响单个key的配置
        else acc.objDeps.push(dep as ChangeFn<FormKeys<T>>)

        return acc
      },
      { strDeps: [], objDeps: [] },
    )
    // ------------------------------处理 dependOn 中字符类型的依赖------------------
    if (strDeps.length) {
      watch(
        strDeps.map(dep => () => model.value[dep]),
        (values) => {
          const depsValue = strDeps.reduce((acc, dep, index) => {
            acc[dep] = values[index]
            return acc
          }, {} as any)
          const readonlyDepsValue = readonly(depsValue)
          delDepsUpdate({
            changeConfig,
            changeValue,
            item,
            readonlyValue: readonlyDepsValue,
            runtimeConfig,
            onConfigUpdated,
            mapKeys,
            model,
            onValueUpdated,
            name,
          })
        },
        // TODO: 默认直接执行一次，后续提供配置控制
        // 不允许deep，必须监听到键,deep会导致当model.value被赋值为一个新对象的时候也会触发watch
        { immediate: true },
      )
    }
    // ------------------------------------------------------------------------------

    // ------------------------------处理 dependOn中对象类型的依赖-----------------------
    const objDepsEntries = Object.entries(objDeps)
    if (objDepsEntries.length) {
      for (const [key, config] of objDepsEntries) {
        watch(
          () => model.value[key],
          (value) => {
            const readonlyDepValue = readonly({ [key]: value }) as any
            const { changeConfig, changeValue } = config
            delDepsUpdate({
              changeConfig,
              changeValue,
              item,
              readonlyValue: readonlyDepValue,
              runtimeConfig,
              onConfigUpdated,
              mapKeys,
              model,
              onValueUpdated,
              name,
            })
          },
          // TODO: 默认直接执行一次，后续提供配置控制,
          // 不允许deep，必须监听到键,deep会导致当model.value被赋值为一个新对象的时候也会触发watch
          { immediate: true },
        )
      }
    }
    // ------------------------------------------------------------------------------
  }
}

function updateConfig<
  O extends Record<string, any>,
  N extends Record<string, any>,
  R extends Record<string, any>,
>(old: O, newC: N, runtime: R, onConfigUpdated: any): N {
  // 更新的是runtimeConfig 否则不生效
  Object.assign(runtime[old.name], newC)
  // 抛出runtimeConfig给外部emits用
  onConfigUpdated && onConfigUpdated(runtime)
  return runtime[old.name]
}
export function deleteName({
  model,
  names,
  onValueUpdated,
}: {
  model: MaybeRef<Record<string, any>>
  names: (string | number | symbol)[]
  onValueUpdated?: any
}) {
  const temp = { ...unref(model) }
  names.forEach((name) => {
    Reflect.deleteProperty(temp, name)
  })
  onValueUpdated && onValueUpdated({ ...temp })
}
/**
 * @param param
 * @param param.model 旧的modelValue
 * @param param.mapKeys mapKeys
 * @param param.values [nameValue, ...mapKeysValues]
 * @param param.name  nameKey
 * @param param.onValueUpdated  modelValue更新的钩子
 * @param param.hidden  是否是隐藏状态
 */
export function updateValue({
  model,
  mapKeys = [],
  values,
  onValueUpdated,
  name = '',
  hidden = false,
}: {
  model: MaybeRef<Record<string, any>>
  values: any[]
  onValueUpdated?: any
  mapKeys?: string[]
  name?: string | number | symbol
  hidden: boolean
}) {
  const newO = values.reduce((acc, v, index) => {
    if (name !== undefined) {
      // 第0项的值为当前表单key的更新值，剩余的为当前表单定义的mapKeys的值
      const isKeyValue = index === 0
      // 非NUP和非hidden状态下才更新
      if (isKeyValue && v !== NUP && !hidden)
        acc[name] = v
      else if (mapKeys[index - 1])
        acc[mapKeys[index - 1]] = v
    }
    else {
      // 非NUP和非hidden状态下才更新
      if (v !== NUP && !hidden && mapKeys[index]) {
        // 不包含当前表单项的值
        acc[mapKeys[index]] = v
      }
    }
    return acc
  }, {})

  onValueUpdated && onValueUpdated({ ...unref(model), ...newO })
}

export function defineFormSchema<T extends Record<string, any>>(
  schema: FormSchema<T>,
) {
  return schema
}

/**
 * 处理changeValue和changeConfig可复用逻辑
 */
function delDepsUpdate<T extends Record<string, any>>({
  changeConfig,
  changeValue,
  item,
  readonlyValue,
  runtimeConfig,
  onConfigUpdated,
  mapKeys,
  model,
  onValueUpdated,
  name,
}: {
  changeConfig: FormItem<FormKeys<T>>['changeConfig']
  changeValue: FormItem<FormKeys<T>>['changeValue']
  item: FormItem<FormKeys<T>> & { name: FormKeys<T> }
  readonlyValue: any
  mapKeys: string[]
  model: Ref<T>
  runtimeConfig: FormSchema<T>['config']
  name: FormKeys<T>
  onValueUpdated: (modelValue: Ref<T>) => void
  onConfigUpdated: (config: FormSchema<T>['config']) => void
}) {
  const newConfig = changeConfig && changeConfig(item, readonlyValue)
  // 更新config
  if (newConfig) {
    const updatedCfg = updateConfig(
      item,
      newConfig,
      runtimeConfig,
      onConfigUpdated,
    )
    // 不缓存的情况下删除name和mapKeys中定义的值,直接return,不需要处理后续的changeValue
    if (!item.cache && updatedCfg.hidden) {
      deleteName({ model, names: [item.name, ...mapKeys], onValueUpdated })
      return
    }
  }
  const newValues = changeValue && changeValue(readonlyValue)
  // 更新值
  if (Array.isArray(newValues)) {
    updateValue({
      model,
      mapKeys,
      values: newValues,
      onValueUpdated,
      name,
      hidden: !!runtimeConfig[item.name].hidden,
    })
  }
}

import {
  type DeepReadonly,
  type MaybeRef,
  type Ref,
  type UnwrapRef,
  h,
  reactive,
  readonly,
  ref,
  watch,
} from 'vue'

export type Widget =
  | 'input'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'slider'
  | 'rate'
  | 'date'
  | 'time'
  | 'datetime'
  | 'upload'
  | 'cascader'
  | 'custom'
type CanModifyFormItemConfigKeys =
  | 'disabled'
  | 'readonly'
  | 'visible'
  | 'hidden'
  | 'required'
  | 'label'
  | 'labelWidth'
  | 'errorMessage'
type Value = any
type AttachValue = any
type CanModifyFormItemConfig = Pick<FormItem, CanModifyFormItemConfigKeys>

type DependOnObj<T extends string> = Partial<
  Record<
    T,
    {
      changeConfig?:
        | FormItem<T>['changeConfig'][]
        | FormItem<T>['changeConfig']
      changeValue?: FormItem<T>['changeValue'][] | FormItem<T>['changeValue']
    }
  >
>
type ReadonlyDependValue<T extends string> = DeepReadonly<{ [K in T]: any }>
export interface FormItem<T extends string = string> {
  /**
   * 表单项类型
   */
  widget: Widget
  /**
   * 类型可以是
   * 1. ['key1', 'key2'] 这样配置的是对当前项对changeConfig/changeValue生效
   * 2. {key1: {changeConfig, changeValue}, key2: {changeConfig, changeValue}} 这样配置的是当key值变动时只触发key配置的此模式下changeConfig/changeValue可接受一个数组
   * 3.  ['key1', 'key2', key3: {changeConfig, changeValue}, key4: {changeConfig, changeValue}]这样配置时， key1/key2的是对当前项对changeConfig/changeValue生效； key3/key4只触发key配置的，此模式下changeConfig/changeValue可接受一个数组
   */
  dependOn?: T[] | DependOnObj<T> | (DependOnObj<T> | T)[]
  changeConfig?: (
    config: CanModifyFormItemConfig,
    deps: ReadonlyDependValue<T>
  ) => CanModifyFormItemConfig
  changeValue?: (value: ReadonlyDependValue<T>) => { value: Value, attachValue: AttachValue }
  disabled?: boolean
  readonly?: boolean
  visible?: boolean
  hidden?: boolean
  rules?: any
  required?: boolean
  label?: string
  labelWidth?: number
  errorMessage?: string
  /**
   * @deprecated from 1.4.0 统一使用 uni-forms 的对齐方式
   */
  labelAlign?: 'left' | 'center' | 'right'
  /**
   * @deprecated from 1.4.0 统一使用 uni-forms 的对齐方式
   */
  labelPosition?: 'top' | 'left'
  /**
   * @deprecated from 1.4.0 统一使用 uni-forms 的对齐方式
   */
  validateTrigger?: 'bind' | 'submit'
  /**
   * @deprecated from 1.4.0 请使用 #label 插槽实现相关功能
   */
  leftIcon?: string
  /**
   * @deprecated from 1.4.0 请使用 #label 插槽实现相关功能
   */
  iconColor?: string
  slots?: {
    label?: (item: FormItem<T> & { name: string }) => any
    default?: (item: FormItem<T> & { name: string }) => any
  }
  widgetProps?: Record<string, any>
  [key: string]: any
}

export interface FormSchema<
  T extends Record<string, any> = Record<string, any>,
> {
  rules?: Record<string, any>
  validateTrigger?: 'bind' | 'submit' | 'blur'
  labelPosition?: 'top' | 'left'
  labelWidth?: string | number
  labelAlign?: 'left' | 'center' | 'right'
  errShowType?: 'undertext' | 'toast' | 'modal'
  border?: boolean
  config: Record<FormKeys<T>, FormItem<FormKeys<T>>>
}

export function defineFormSchema<T extends Record<string, any>>(
  schema: FormSchema<T>,
) {
  return schema
}
export type FormKeys<T> = T extends MaybeRef<T> ? keyof UnwrapRef<T> : keyof T
export type PickModel<
  T extends Record<string, any>,
  K extends string,
> = Readonly<Pick<T, K>>

/**
 * @description 处理dependOn的行为，dependOn修改时需要触发 changeConfig 和 changeValue
 */
export function useDependOn<T extends Record<string, any>>(
  model: T,
  list: (FormItem<FormKeys<T>> & { name: string })[],
) {
  for (let index = 0; index < list.length; index++) {
    const item = list[index]
    const { changeConfig, changeValue } = item
    const deps = Array.isArray(item.dependOn) ? item.dependOn : [item.dependOn]
    const { strDeps, objDeps } = deps.reduce(
      (
        acc: { strDeps: FormKeys<T>[], objDeps: DependOnObj<FormKeys<T>>[] },
        dep,
      ) => {
        // 影响当前项配置的changeConfig 和 changeValue
        if (typeof dep === 'string')
          acc.strDeps.push(dep)
        // 对象配置，影响单个key的配置
        else acc.objDeps.push(dep as DependOnObj<FormKeys<T>>)

        return acc
      },
      { strDeps: [], objDeps: [] },
    )
    // 处理当前项配置的changeConfig 和 changeValue
    watch(
      () =>
        strDeps.reduce((acc, strDep) => {
          acc[strDep] = readonly(model[strDep])
          return acc
        }, {} as any),
      (values) => {
        changeConfig && changeConfig(item, values)
        changeValue && changeValue(values)
      },
      // TODO: 默认直接执行一次，深度监听，后续提供配置控制
      { immediate: true, deep: true },
    )
    const objDepsEntries = Object.entries(objDeps)
    // 处理对象配置的changeConfig 和 changeValue
    for (const [key, config] of objDepsEntries) {
      watch(
        () => readonly({ [key]: model[key] }),
        (value) => {
          // if (Array.isArray(changeValue))
          //   changeValue.forEach(changeValue => changeValue(config, value))
        },
        // TODO: 默认直接执行一次，深度监听，后续提供配置控制
        { immediate: true, deep: true },
      )
    }
  }
}
/**
 * usage
 */
const model = reactive({
  name: '',
  age: '',
  x: '',
})

type Model = typeof model

/**
 *
 * @type {defineFormSchema<Model>}
 */
const schema = defineFormSchema<Model>({
  labelPosition: 'left',
  config: {
    name: {
      widget: 'cascader',
      label: '姓名',
      dependOn: [
        'age',
        {
          x: {
            changeConfig: [
              (config) => {
                return config
              },
            ],
          },
          age: {
            changeConfig: (config) => {
              return config
            },
          },
        },
      ],
      changeConfig(config, deps: PickModel<Model, 'age'>) {
        config.disabled = deps.age === '1'
        return config
      },
      slots: {
        default: () => {
          return h('div', {}, 'this is div element')
        },
      },
    },
    age: {
      dependOn: ['name'],
      widget: 'checkbox',
      label: '年龄',
    },
    x: {
      widget: 'cascader',
      dependOn: ['x'],
      changeConfig(config, deps: PickModel<Model, 'x'>) {
        config.readonly = deps.x === 'x'
        return config
      },
    },
  },
})
// useDependOn(model, schema)

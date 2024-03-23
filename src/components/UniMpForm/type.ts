import type { DeepReadonly, MaybeRef, UnwrapRef } from 'vue'

export const NUP = Symbol('do_not_update_value')

export type Widget =
  | 'uni-combox'
  | 'uni-countdown'
  | 'uni-data-checkbox'
  | 'uni-data-picker'
  | 'uni-data-select'
  | 'uni-dateformat'
  | 'uni-datetime-picker'
  | 'uni-easyinput'
  | 'uni-fav'
  | 'uni-file-picker'
  | 'uni-group'
  | 'uni-icons'
  | 'uni-indexed-list'
  | 'uni-link'
  | 'uni-number-box'
  | 'uni-rate'
  | 'uni-calendar'
type CanModifyFormItemConfigKeys =
  | 'disabled'
  | 'readonly'
  | 'visible'
  | 'hidden'
  | 'required'
  | 'label'
  | 'labelWidth'
  | 'errorMessage'

type CanModifyFormItemConfig = Pick<FormItem, CanModifyFormItemConfigKeys>
export interface ChangeFn<T extends string> {
  changeConfig?: FormItem<T>['changeConfig']
  changeValue?: FormItem<T>['changeValue']
}
export type DependOnObj<T extends string> = Partial<Record<T, ChangeFn<T>>>
export type ReadonlyDependValue<T extends string> = DeepReadonly<{
  [K in T]: any;
}>
// 组件需要自己实现这些功能
export type WidgetPropsInFormItem = 'disabled' | 'readonly' | 'clearable'
export interface FormItem<T extends string = string> {
  /**
   * 表单项类型
   */
  widget?: Widget
  /**
   * 类型可以是
   * 1. ['key1', 'key2'] 这样配置的是对当前项对changeConfig/changeValue生效
   * 2. {key1: {changeConfig, changeValue}, key2: {changeConfig, changeValue}} 这样配置的是当key值变动时只触发key配置的
   * 3.  ['key1', 'key2', key3: {changeConfig, changeValue}, key4: {changeConfig, changeValue}]这样配置时， key1/key2的是对当前项对changeConfig/changeValue生效； key3/key4只触发key配置的
   */
  dependOn?: T[] | DependOnObj<T> | (DependOnObj<T> | T)[]
  /**
   *
   *  当前项组件抛出的其他值
   */
  mapKeys?: string[]
  changeConfig?: (
    config: CanModifyFormItemConfig,
    deps: ReadonlyDependValue<T>
  ) => CanModifyFormItemConfig
  /**
   *
   * @returns {values} values返回空数组或者undefined时不更新值，其中返回值数组的第一项对应的是当前项的值，剩余项是mapKeys按顺序对应的键值
   */
  changeValue?: (deps: ReadonlyDependValue<T>) => any[] | typeof NUP
  disabled?: boolean
  /**
   * 表单label后跟的符号默认为':'
   */
  symbol?: string | false
  readonly?: boolean
  /**
   * 在进行显示隐藏操作时是否要保留值
   */
  cache?: boolean
  /**
   * uni 小程序暂时不支持visible，实现需要自己加个view标签，并不是很想加
   */
  visible?: boolean
  hidden?: boolean
  clearable?: boolean
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
  /**
   * 兜底
   */
  [key: string]: any
}

export interface FormSchema<
  T extends Record<string, any> = Record<string, any>,
> {
  symbol?: string | false
  rules?: Record<string, any>
  validateTrigger?: 'bind' | 'submit' | 'blur'
  labelPosition?: 'top' | 'left'
  labelWidth?: string | number
  labelAlign?: 'left' | 'center' | 'right'
  errShowType?: 'undertext' | 'toast' | 'modal'
  border?: boolean
  config: Record<FormKeys<T>, FormItem<FormKeys<T>>>
  /**
   * 在进行显示隐藏操作时是否要保留值
   */
  cache?: boolean
}
export type FormKeys<T> = T extends MaybeRef<T> ? keyof UnwrapRef<T> : keyof T
export type PickModel<
  T extends MaybeRef<Record<string, any>>,
  K extends keyof UnwrapRef<T>,
> = Readonly<Pick<T['value'], K>>

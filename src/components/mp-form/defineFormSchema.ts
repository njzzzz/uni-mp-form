// interface FormItem<K> {
//   x: K
// }

// export interface FormSchema<T extends Record<string, FormItem<keyof T>>> {
//   rules: Record<string, any>
//   validateTrigger: 'bind' | 'submit' | 'blur'
//   labelPosition: 'top' | 'left'
//   labelWidth: string | number
//   labelAlign: 'left' | 'center' | 'right'
//   errShowType: 'undertext' | 'toast' | 'modal'
//   border: boolean
//   x: keyof T
//   config: T
// }

// export function defineFormSchema<T extends Record<string, FormItem<keyof T>>>(schema: Partial<FormSchema<T>>) {}

// defineFormSchema({
//   x: 'a',
//   config: {
//     a: {
//       x: '',
//     },
//   },
// })

interface FormItem<K> {
  x: K
}

  type ExcludeA<T> = T extends 'a' ? never : T

interface FormSchema<T, K extends keyof T = keyof T> {
  rules: Record<string, any>
  validateTrigger: 'bind' | 'submit' | 'blur'
  labelPosition: 'top' | 'left'
  labelWidth: string | number
  labelAlign: 'left' | 'center' | 'right'
  errShowType: 'undertext' | 'toast' | 'modal'
  border: boolean
  x: K
  config: K extends keyof T ? { [P in K]: FormItem<ExcludeA<keyof T>> } : never
}

export function defineFormSchema<T>(schema: Partial<FormSchema<T>>) {}

defineFormSchema({
  x: 'a',
  config: {
    a: {
      x: 'b',
    },
    b: {
      x: 'b',
    },
  },
})

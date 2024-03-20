interface FormItem<T> {
  dependOn: T[]
  changeConfig: (config: FormItem<T>) => FormItem<T>
  changeValue: (value: any) => void
}

export interface FormSchema<T extends Record<string, Partial<FormItem<keyof T>>>> {
  rules: Record<string, any>
  validateTrigger: 'bind' | 'submit' | 'blur'
  labelPosition: 'top' | 'left'
  labelWidth: string | number
  labelAlign: 'left' | 'center' | 'right'
  errShowType: 'undertext' | 'toast' | 'modal'
  border: boolean
  config: T
}

export function defineFormSchema<T extends Record<string, Partial<FormItem<keyof T>>>>(schema: Partial<FormSchema<T>>) {
  return schema
}
// test
defineFormSchema({
  config: {
    a: {
      dependOn: ['a'],
      // changeConfig(c) {
      //   return c
      // },
      // changeValue(value) {

      // },
    },
    b: {},
  },
})

// interface FormItem<T> {
//   dependOn: T[]
//   changeConfig: (config: FormItem<T>) => FormItem<T>
//   changeValue: (value: any) => void
// }

// export interface FormSchema<T extends Record<string, Partial<FormItem<keyof T>>>> {
//   rules: Record<string, any>
//   validateTrigger: 'bind' | 'submit' | 'blur'
//   labelPosition: 'top' | 'left'
//   labelWidth: string | number
//   labelAlign: 'left' | 'center' | 'right'
//   errShowType: 'undertext' | 'toast' | 'modal'
//   border: boolean
//   config: T
// }

// export function defineFormSchema<T extends Record<string, FormItem<keyof T> >>(schema: Partial<FormSchema< T>>) {
//   return schema
// }
// // test
// defineFormSchema({
//   config: {
//     a: {
//       dependOn: [''],
//       changeConfig(c, deps) {
//         return c
//       },
//       changeValue(value) {

//       },
//       // changeConfig(c) {
//       //   return c
//       // },
//       // changeValue(value) {

//       // },
//     },
//     b: {},
//   },
// })

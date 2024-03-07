import { useI18n } from 'vue-i18n'
import type { ListOption } from '@/types/local'
import { ENUMS, ENUMS_TRANSLATION_KEY } from '@/constants/rules'

interface Options<T> {
  excludeKeys?: (keyof T)[]
  excludeValues?: T[keyof T][]
  pickKeys?: (keyof T)[]
  pickValues?: T[keyof T][]
  extraProps?: (key: keyof T, value: T[keyof T]) => Record<string, unknown>
}

/**
 * The `useEnum` function takes an enum object and returns functions to
 * convert the enum values to labels and options.
 *
 * @param enumObj - The `enumObj` parameter is the base enum object.
 */
export default function useEnum<E extends Record<string, number | string>>(enumObj: E) {
  const { t } = useI18n()
  const translationKey = Object.keys(ENUMS).find((key) => ENUMS[key] === enumObj)

  function toLabel(value: E[keyof E]) {
    const key = Object.keys(enumObj).find((key) => enumObj[key] === value)
    return t(`${ENUMS_TRANSLATION_KEY}.${translationKey}.${String(key)}`)
  }

  /**
   * The `toOption` function takes an enum object and a value and returns an object with the
   * enum key as label and the enum value as value.
   *
   * @param value - The `value` parameter is a value of the enum.
   * @param options - The `options` optional parameter is an object with additional options.
   */
  function toOption(
    value: E[keyof E],
    options?: {
      extraProps?: (key: keyof E, value: E[keyof E]) => Record<string, unknown>
    }
  ): ListOption<E[keyof E]> {
    const key = Object.keys(enumObj).find((key) => enumObj[key] === value)

    let option = { label: toLabel(value), value }
    if (options?.extraProps && key) option = { ...option, ...options.extraProps(key, value) }

    return option
  }

  /**
   * The `toOptions` function takes an enum object and returns an array of objects with the
   * enum key as label and the enum value as value.
   *
   * @param valuesOrOptions - The `valuesOrOptions` parameter is an array with values of the enum or an object with additional options.
   * @param options - The `options` optional parameter is an object with additional options.
   */
  function toOptions(
    valuesOrOptions?: E[keyof E][] | Options<E>,
    options?: Options<E>
  ): ListOption<E[keyof E]>[] {
    let finalOptions: Options<E> | undefined
    let filterValues: E

    if (Array.isArray(valuesOrOptions)) {
      filterValues = valuesOrOptions.reduce((acc, value) => {
        const key = (Object.keys(enumObj) as (keyof E)[]).find((key) => enumObj[key] === value)
        if (key) acc[key] = value
        return acc
      }, {} as E)
      finalOptions = options
    } else {
      filterValues = enumObj
      finalOptions = valuesOrOptions as Options<E>
    }

    const {
      excludeKeys = [],
      excludeValues = [],
      pickKeys = [],
      pickValues = [],
      extraProps = undefined
    } = finalOptions || {}

    return (Object.keys(filterValues) as (keyof E)[]).reduce(
      (acc, key) => {
        const value = filterValues[key]
        if (pickKeys?.length && !pickKeys.includes(key)) return acc
        if (pickValues.length && !pickValues.includes(value)) return acc
        if (excludeKeys.includes(key) || excludeValues.includes(value)) return acc

        acc.push(toOption(value, { extraProps }))

        return acc
      },
      [] as ListOption<E[keyof E]>[]
    )
  }

  return {
    toLabel,
    toOption,
    toOptions
  }
}

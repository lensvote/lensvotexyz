/**
 *
 * @param object - Object to remove properties from
 * @param name - Name of property to remove
 * @returns object with property removed
 */
export const omit = <T extends object, K extends keyof T>(
  object: T,
  name: K,
) => {
  const omitedResult = Object.entries(object).reduce((acc, [key, val]) => {
    if (name === key) {
      return acc
    }
    return {
      ...acc,
      [key]: val,
    }
  }, {})
  return omitedResult as Omit<T, K>
}

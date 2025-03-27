/**
 * 绑定方法集合
 * @param instance {object}
 */
export function bindMethods<T extends object>(instance: T) {
    const prototype = Object.getPrototypeOf(instance)
    const propertyNames = Object.getOwnPropertyNames(prototype)

    // console.log('prototype:', prototype)
    // console.log('propertyNames:', propertyNames)

    propertyNames.forEach((propertyName) => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName)
        const propertyValue = instance[propertyName as keyof T]

        // console.log('descriptor:', descriptor)
        // console.log('propertyValue:', propertyValue)
        if (
            typeof propertyValue === 'function' &&
            propertyName !== 'constructor' &&
            descriptor &&
            !descriptor.get &&
            !descriptor.set
        ) {
            // console.log('propertyValue:', propertyValue)
            instance[propertyName as keyof T] = propertyValue.bind(instance)
        }
    })
}

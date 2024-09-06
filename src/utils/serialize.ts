import { isObject, map } from "@edsolater/fnkit"
import { deserializeBlob, isBlob, isSerlizedBlob, serializeBlob } from "./serializeBlob"

/** used with {@link deserializeData} */
export function serializeData(data: any) {
  if (isBlob(data)) {
    return serializeBlob(data)
  } else if (isObject(data)) {
    return map(data, (v) => serializeData(v))
  }
  return data
}

/** used with {@link serializeData} */
export function deserializeData(data: string) {
  if (isSerlizedBlob(data)) {
    return deserializeBlob(data)
  } else if (isObject(data)) {
    return map(data, (v) => deserializeData(v))
  }
  return data
}

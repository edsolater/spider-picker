import { asyncChangeObjectWithRules, isObject } from "@edsolater/fnkit"
import { deserializeBlob, isBlob, isSerializedBlob, serializeBlob } from "./serializeBlob"

/** used with {@link serializeData} */
export async function deserializeData(data: any) {
  if (isSerializedBlob(data)) {
    return deserializeBlob(data)
  } else {
    return asyncChangeObjectWithRules(data, [[isSerializedBlob, deserializeBlob]])
  }
}

/** used with {@link deserializeData} */
export async function serializeData(data: any) {
  if (isBlob(data)) {
    return serializeBlob(data)
  } else if (isObject(data)) {
    return asyncChangeObjectWithRules(data, [[isBlob, serializeBlob]])
  }
}

import { isPromise, type AnyObj } from "@edsolater/fnkit"

export type SerlizedBlob = {
  $_type: "Blob"
  $_blobType: string // MIME type. e.g. 'image/png'
  $_data: string /* JSON serlizable string (base64) */
}
export async function serializeBlob(blob: Blob): Promise<SerlizedBlob> {
  const p = new Promise<SerlizedBlob>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        $_type: "Blob",
        $_blobType: blob.type,
        $_data: reader.result as string,
      } as SerlizedBlob)
    }
    reader.readAsDataURL(blob)
  })
  p["$innerIs"] = "serializedBlob"
  return p
}

export async function deserializeBlob(data: SerlizedBlob): Promise<Blob> {
  return new Promise((resolve) => {
    const base64 = data.$_data.split(",")[1]
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    resolve(new Blob([byteArray], { type: data.$_blobType }))
  })
}

export function isSerializedBlob(data: any): data is SerlizedBlob {
  return data?.$_type === "Blob"
}

export function isSerlizedBlobPromise(data: any): data is Promise<SerlizedBlob> {
  return isPromise(data) && (data as AnyObj).$innerIs === "serializeBlob"
}

export function isBlob(data: any): data is Blob {
  return data instanceof Blob
}

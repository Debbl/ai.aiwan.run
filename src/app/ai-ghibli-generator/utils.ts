export async function objectURLToBase64(objectURL: string) {
  const response = await fetch(objectURL)
  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(blob)

    reader.onloadend = () => {
      const base64String = reader.result as string
      resolve(base64String)
    }

    reader.onerror = (error) => {
      reject(error)
    }
  })
}

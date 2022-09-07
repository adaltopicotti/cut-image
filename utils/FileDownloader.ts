export const fileDownloader = (
    url: string,
    filename: string
  ): Promise<string | undefined> => {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        return link.href
      })
      .catch(err => {
        console.error(err)
        return undefined
      })
  }
  
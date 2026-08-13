export const SHARE_CAPTION =
  'Just framed my builder identity for HH Goa 2026 \u{1F680}\n\nSee you in Goa.\n\n#FrameInGoa #HHGoa2026'

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename = 'hh-goa-2026-pfp.png') {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // Revoke shortly after the click to avoid killing the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 4000)
  }, 'image/png')
}

export function openShareToX(caption: string = SHARE_CAPTION) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

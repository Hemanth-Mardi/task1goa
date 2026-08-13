import type { BuilderInfo } from '../types'
import { getBuilderTitle } from './builderTitles'

const COLORS = {
  ink: '#0B0E11',
  panel: '#12161B',
  sand: '#F3ECDD',
  rust: '#FF5A36',
  gold: '#F5B93E',
  sea: '#1FB6A6',
}

/** Ensures custom webfonts are loaded before we draw text to canvas. */
export async function ensureFontsReady(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('700 60px "Space Grotesk"'),
      document.fonts.load('600 30px "Space Grotesk"'),
      document.fonts.load('500 24px "JetBrains Mono"'),
      document.fonts.ready,
    ])
  } catch {
    // Fonts API not supported — canvas will fall back to system fonts.
  }
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawCornerMark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, color: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, size)
  ctx.lineTo(0, 0)
  ctx.lineTo(size, 0)
  ctx.stroke()
  ctx.restore()
}

function drawSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx, cy - r)
  ctx.quadraticCurveTo(cx + r * 0.15, cy - r * 0.15, cx + r, cy)
  ctx.quadraticCurveTo(cx + r * 0.15, cy + r * 0.15, cx, cy + r)
  ctx.quadraticCurveTo(cx - r * 0.15, cy + r * 0.15, cx - r, cy)
  ctx.quadraticCurveTo(cx - r * 0.15, cy - r * 0.15, cx, cy - r)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawDotGrid(ctx: CanvasRenderingContext2D, x: number, y: number, cols: number, rows: number, gap: number, color: string, r = 2) {
  ctx.save()
  ctx.fillStyle = color
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      ctx.beginPath()
      ctx.arc(x + i * gap, y + j * gap, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

/**
 * Renders the branded HH Goa 2026 PFP frame around a pre-cropped square photo.
 * Returns a new canvas at `size`x`size`, ready to export as PNG.
 */
export function renderPfpFrame(sourcePhoto: HTMLCanvasElement, size = 1080): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const border = Math.round(size * 0.052) // outer branded ring
  const photoInset = border + Math.round(size * 0.018)

  // Base background (visible only in the border ring, since photo covers the center)
  const bg = ctx.createLinearGradient(0, 0, size, size)
  bg.addColorStop(0, COLORS.ink)
  bg.addColorStop(1, '#161B21')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)

  // Photo, filling the inner square
  const photoSize = size - photoInset * 2
  ctx.save()
  roundRectPath(ctx, photoInset, photoInset, photoSize, photoSize, size * 0.028)
  ctx.clip()
  ctx.drawImage(sourcePhoto, 0, 0, sourcePhoto.width, sourcePhoto.height, photoInset, photoInset, photoSize, photoSize)

  // Subtle bottom gradient scrim so bottom branding text stays legible over any photo
  const scrim = ctx.createLinearGradient(0, size - size * 0.24, 0, size - photoInset)
  scrim.addColorStop(0, 'rgba(11,14,17,0)')
  scrim.addColorStop(1, 'rgba(11,14,17,0.78)')
  ctx.fillStyle = scrim
  ctx.fillRect(photoInset, size - size * 0.24, photoSize, size * 0.24 - 0)
  ctx.restore()

  // Outer branded ring
  ctx.save()
  roundRectPath(ctx, border * 0.42, border * 0.42, size - border * 0.84, size - border * 0.84, size * 0.045)
  const ringGrad = ctx.createLinearGradient(0, 0, size, size)
  ringGrad.addColorStop(0, COLORS.rust)
  ringGrad.addColorStop(0.5, COLORS.gold)
  ringGrad.addColorStop(1, COLORS.sea)
  ctx.strokeStyle = ringGrad
  ctx.lineWidth = Math.max(3, size * 0.008)
  ctx.stroke()
  ctx.restore()

  // Corner marks, inset from the photo edges
  const cm = size * 0.05
  const co = photoInset + size * 0.012
  drawCornerMark(ctx, co, co, cm, 0, COLORS.sand)
  drawCornerMark(ctx, size - co, co, cm, Math.PI / 2, COLORS.sand)
  drawCornerMark(ctx, size - co, size - co, cm, Math.PI, COLORS.sand)
  drawCornerMark(ctx, co, size - co, cm, -Math.PI / 2, COLORS.sand)

  // Top-left badge: HH GOA 2026
  ctx.save()
  ctx.textBaseline = 'alphabetic'
  const badgeX = photoInset + size * 0.036
  const badgeY = photoInset + size * 0.075
  ctx.fillStyle = 'rgba(11,14,17,0.55)'
  const badgeText = 'HH GOA 2026'
  ctx.font = `700 ${Math.round(size * 0.034)}px "Space Grotesk", sans-serif`
  const badgeW = ctx.measureText(badgeText).width + size * 0.05
  roundRectPath(ctx, badgeX - size * 0.02, badgeY - size * 0.038, badgeW, size * 0.058, size * 0.014)
  ctx.fill()
  ctx.fillStyle = COLORS.sand
  ctx.fillText(badgeText, badgeX, badgeY)
  ctx.restore()

  // Top-right sparkle accent
  drawSparkle(ctx, size - photoInset - size * 0.055, photoInset + size * 0.06, size * 0.02, COLORS.gold)

  // Bottom branding block
  ctx.save()
  ctx.textAlign = 'left'
  const bx = photoInset + size * 0.036
  ctx.font = `700 ${Math.round(size * 0.04)}px "Space Grotesk", sans-serif`
  ctx.fillStyle = COLORS.sand
  ctx.fillText('HACKER HOUSE GOA', bx, size - photoInset - size * 0.058)

  ctx.font = `500 ${Math.round(size * 0.02)}px "JetBrains Mono", monospace`
  ctx.fillStyle = COLORS.gold
  ctx.fillText('BUILD  ·  SHIP  ·  SHARE', bx, size - photoInset - size * 0.03)

  ctx.textAlign = 'right'
  ctx.font = `500 ${Math.round(size * 0.018)}px "JetBrains Mono", monospace`
  ctx.fillStyle = COLORS.sea
  ctx.fillText('#FrameInGoa', size - photoInset - size * 0.036, size - photoInset - size * 0.03)
  ctx.restore()

  return canvas
}

/**
 * Renders the optional Builder ID Card: event-style card with photo,
 * name, stack/role, an auto-generated builder title, and handles.
 */
export function renderBuilderCard(sourcePhoto: HTMLCanvasElement, info: BuilderInfo, size = 1080): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const pad = size * 0.06

  // Background
  const bg = ctx.createLinearGradient(0, 0, size, size)
  bg.addColorStop(0, COLORS.ink)
  bg.addColorStop(1, '#181212')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)

  // Ambient gradient glow, top-right
  const glow = ctx.createRadialGradient(size * 0.85, size * 0.1, 0, size * 0.85, size * 0.1, size * 0.55)
  glow.addColorStop(0, 'rgba(255,90,54,0.35)')
  glow.addColorStop(1, 'rgba(255,90,54,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  // Dot grid accent, bottom-left
  drawDotGrid(ctx, pad, size - pad - size * 0.09, 7, 7, size * 0.015, 'rgba(243,236,221,0.18)')

  // Outer card border
  ctx.save()
  roundRectPath(ctx, pad * 0.5, pad * 0.5, size - pad, size - pad, size * 0.03)
  const ringGrad = ctx.createLinearGradient(0, 0, size, size)
  ringGrad.addColorStop(0, COLORS.rust)
  ringGrad.addColorStop(0.5, COLORS.gold)
  ringGrad.addColorStop(1, COLORS.sea)
  ctx.strokeStyle = ringGrad
  ctx.lineWidth = Math.max(3, size * 0.006)
  ctx.stroke()
  ctx.restore()

  // Header
  ctx.textAlign = 'left'
  ctx.fillStyle = COLORS.sand
  ctx.font = `700 ${Math.round(size * 0.032)}px "Space Grotesk", sans-serif`
  ctx.fillText('HH GOA 2026', pad, pad + size * 0.02)
  ctx.textAlign = 'right'
  ctx.font = `500 ${Math.round(size * 0.017)}px "JetBrains Mono", monospace`
  ctx.fillStyle = COLORS.gold
  ctx.fillText('BUILDER PASS', size - pad, pad + size * 0.02)

  // Photo — square with rounded corners, upper-middle of card
  const photoSize = size * 0.42
  const photoX = (size - photoSize) / 2
  const photoY = pad + size * 0.06
  ctx.save()
  roundRectPath(ctx, photoX, photoY, photoSize, photoSize, size * 0.02)
  ctx.clip()
  ctx.drawImage(sourcePhoto, 0, 0, sourcePhoto.width, sourcePhoto.height, photoX, photoY, photoSize, photoSize)
  ctx.restore()
  ctx.save()
  roundRectPath(ctx, photoX, photoY, photoSize, photoSize, size * 0.02)
  ctx.strokeStyle = 'rgba(243,236,221,0.35)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()

  let cursorY = photoY + photoSize + size * 0.075

  // Name
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.sand
  ctx.font = `700 ${Math.round(size * 0.05)}px "Space Grotesk", sans-serif`
  ctx.fillText(info.name.toUpperCase(), size / 2, cursorY)
  cursorY += size * 0.042

  // Stack / role
  ctx.font = `500 ${Math.round(size * 0.022)}px "JetBrains Mono", monospace`
  ctx.fillStyle = COLORS.sea
  ctx.fillText(info.stack.toUpperCase(), size / 2, cursorY)
  cursorY += size * 0.052

  // Builder title badge
  const title = getBuilderTitle(info.stack)
  ctx.font = `600 ${Math.round(size * 0.024)}px "Space Grotesk", sans-serif`
  const titleText = `"${title}"`
  const titleW = ctx.measureText(titleText).width + size * 0.06
  const titleH = size * 0.05
  roundRectPath(ctx, size / 2 - titleW / 2, cursorY - titleH * 0.72, titleW, titleH, titleH / 2)
  ctx.fillStyle = 'rgba(245,185,62,0.14)'
  ctx.fill()
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = COLORS.gold
  ctx.fillText(titleText, size / 2, cursorY)
  cursorY += size * 0.07

  // Handles
  const handles: string[] = []
  if (info.xUsername) handles.push(`@${info.xUsername.replace(/^@/, '')} on X`)
  if (info.githubUsername) handles.push(`${info.githubUsername.replace(/^@/, '')} on GitHub`)
  if (handles.length) {
    ctx.font = `400 ${Math.round(size * 0.018)}px "JetBrains Mono", monospace`
    ctx.fillStyle = 'rgba(243,236,221,0.65)'
    ctx.fillText(handles.join('   ·   '), size / 2, cursorY)
  }

  // Footer
  ctx.textAlign = 'left'
  ctx.font = `500 ${Math.round(size * 0.018)}px "JetBrains Mono", monospace`
  ctx.fillStyle = 'rgba(243,236,221,0.55)'
  ctx.fillText('BUILD · SHIP · SHARE', pad, size - pad)
  ctx.textAlign = 'right'
  ctx.fillStyle = COLORS.rust
  ctx.fillText('#FrameInGoa', size - pad, size - pad)

  return canvas
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not export the image. Please try again.'))
    }, 'image/png')
  })
}

/**
 * Fill every `.hex` caption from the swatch it labels, at render time.
 *
 * These captions used to be literal text, so they kept asserting the previous
 * palette's values while the chip beside them already showed the new one. A
 * spec page whose caption contradicts its own swatch is worse than no caption.
 *
 * Mark up a swatch as:  <div class="swatch"><div class="chip" style="background:var(--x)"></div>…<div class="hex"></div></div>
 */
(function () {
  const toHex = (rgb) => {
    const m = rgb.match(/\d+/g)
    if (m === null || m.length < 3) return rgb
    return '#' + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('')
  }
  const fill = () => {
    // `<span class="hex" data-token="--fg">` resolves the token by name. Used
    // where the value is printed as prose rather than shown as a swatch.
    const rootStyle = getComputedStyle(document.documentElement)
    for (const el of document.querySelectorAll('.hex[data-token]')) {
      const raw = rootStyle.getPropertyValue(el.dataset.token).trim()
      el.textContent = raw.startsWith('#') ? raw : toHex(raw)
    }
    for (const swatch of document.querySelectorAll('.swatch')) {
      const chip = swatch.querySelector('.chip')
      const out = swatch.querySelector('.hex')
      if (chip === null || out === null) continue
      const cs = getComputedStyle(chip)
      // A chip carries its value as background, or as color when it is a text sample.
      const raw = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : cs.color
      out.textContent = toHex(raw)
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill)
  else fill()
})()

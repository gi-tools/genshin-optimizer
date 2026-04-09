/**
 * Copy char_Sim_*_gen.json from gi/dm-localization to gi/localization
 * (char_Sim_Foo_gen.json -> char_Sim_Foo.json per locale).
 *
 * Usage: node scripts/copy-sim-char-locales.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dmBase = path.join(root, 'libs/gi/dm-localization/assets/locales')
const giBase = path.join(root, 'libs/gi/localization/assets/locales')

const simGenPattern = /^char_Sim_.*_gen\.json$/

for (const ent of fs.readdirSync(dmBase, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue
  const lang = ent.name
  const dmDir = path.join(dmBase, lang)
  const giDir = path.join(giBase, lang)
  fs.mkdirSync(giDir, { recursive: true })

  for (const f of fs.readdirSync(dmDir)) {
    if (!simGenPattern.test(f)) continue
    const destName = f.replace(/_gen\.json$/, '.json')
    const src = path.join(dmDir, f)
    const dest = path.join(giDir, destName)
    fs.copyFileSync(src, dest)
    console.log(`${lang}: ${f} -> ${destName}`)
  }
}

console.log('Done.')

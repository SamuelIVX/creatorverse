/**
 * Spec 12 tests: the submission README exists, every Required feature is
 * checked, the walkthrough asset is referenced and present, and the stretch
 * checklist matches what the code actually implements.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)))

function readREADME() {
  return fs.readFileSync(path.join(root, 'README.md'), 'utf8')
}

/**
 * Collects the checkbox lines under a given section heading.
 * @param {string} markdown - The README source.
 * @param {string} heading - The section heading text.
 * @returns {Array<string>} The checkbox lines in that section.
 */
function checklistSection(markdown, heading) {
  const lines = markdown.split('\n')
  const start = lines.findIndex((l) => l.startsWith(`### ${heading}`))
  const end = lines.slice(start + 1).findIndex((l) => l.startsWith('### '))
  const section = lines.slice(start + 1, end === -1 ? undefined : start + 1 + end)
  return section.filter((l) => /^\s*- \[[ x]\]/.test(l))
}

describe('submission README', () => {
  it('readme_present', () => {
    const readme = path.join(root, 'README.md')
    expect(fs.existsSync(readme)).toBe(true)
    expect(fs.statSync(readme).size).toBeGreaterThan(0)
  })

  it('feature_checklist_complete', () => {
    const required = checklistSection(readREADME(), 'Required Features')
    expect(required.length).toBeGreaterThanOrEqual(8)
    for (const line of required) {
      expect(line).toMatch(/^\s*- \[x\]/)
    }
  })

  it('walkthrough_linked', () => {
    const readme = readREADME()
    const match = readme.match(/!\[[^\]]*\]\(([^)]+\.gif)\)/)
    expect(match).not.toBeNull()
    const asset = match[1]
    expect(fs.existsSync(path.join(root, asset))).toBe(true)
  })

  it('checklist_matches_reality', () => {
    const stretch = checklistSection(readREADME(), 'Stretch Features')

    const cardCss = fs.readFileSync(
      path.join(root, 'src/styles/components.css'),
      'utf8',
    )
    const cardLayoutImpl = /\.creator-grid/.test(cardCss) && /\.card\b/.test(cardCss)
    const imageOnCardImpl = /\.card-image/.test(cardCss)
    const picoInstalled = fs.existsSync(path.join(root, 'node_modules/@picocss/pico'))

    expect(stretch.some((l) => /^-\s*\[x\] Card layout/.test(l))).toBe(cardLayoutImpl)
    expect(stretch.some((l) => /^-\s*\[x\] Image on card/.test(l))).toBe(imageOnCardImpl)
    expect(stretch.some((l) => /^-\s*\[ \] PicoCSS styling/.test(l))).toBe(!picoInstalled)
  })
})

/**
 * Vitest test setup.
 * Runs RTL cleanup after each test and registers jest-dom matchers.
 * RTL only auto-cleans when Vitest runs with `globals: true`; this project uses
 * explicit imports, so cleanup is wired manually (see LESSONS.md).
 */
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(cleanup)

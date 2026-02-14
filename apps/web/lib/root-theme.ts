/**
 * @name getRootTheme
 * @description Always returns 'dark' — Sentrial dark-only theme.
 */
export async function getRootTheme() {
  return 'dark' as const;
}

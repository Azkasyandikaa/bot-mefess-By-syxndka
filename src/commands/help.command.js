export function handleHelpCommand() {
  return {
    ok: true,
    text: [
      '.confess',
      '.stopconfess',
      '.help',
      '.status'
    ].join('\n')
  };
}
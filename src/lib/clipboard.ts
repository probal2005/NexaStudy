export async function copyText(
  text: string,
): Promise<boolean> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.clipboard
  ) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch (error) {
    console.error(
      'Clipboard copy failed:',
      error,
    );

    return false;
  }
}

export async function readClipboard(): Promise<
  string | null
> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.clipboard
  ) {
    return null;
  }

  try {
    return await navigator.clipboard.readText();
  } catch (error) {
    console.error(
      'Clipboard read failed:',
      error,
    );

    return null;
  }
}
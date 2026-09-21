export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

export function isServer(): boolean {
  return !isBrowser();
}

export function getCurrentOrigin(): string {
  if (!isBrowser()) {
    return '';
  }

  return window.location.origin;
}

export function openExternalUrl(
  url: string,
): void {
  if (!isBrowser()) {
    return;
  }

  window.open(
    url,
    '_blank',
    'noopener,noreferrer',
  );
}

export function scrollToTop(
  behavior: ScrollBehavior = 'smooth',
): void {
  if (!isBrowser()) {
    return;
  }

  window.scrollTo({
    top: 0,
    behavior,
  });
}

export function scrollToElement(
  elementId: string,
  behavior: ScrollBehavior = 'smooth',
): void {
  if (!isBrowser()) {
    return;
  }

  document
    .getElementById(elementId)
    ?.scrollIntoView({
      behavior,
      block: 'start',
    });
}
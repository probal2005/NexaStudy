export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSession {
  user: AuthUser;
  token?: string;
}

const SESSION_KEY = 'nexastudy_session_v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export async function getSession(): Promise<AuthSession | null> {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function signIn(
  email: string,
  _password: string,
): Promise<AuthSession> {
  const session: AuthSession = {
    user: {
      id: 'demo-user',
      email,
      name: 'Student',
    },
  };

  if (isBrowser()) {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    );
  }

  return session;
}

export async function signUp(
  name: string,
  email: string,
  _password: string,
): Promise<AuthSession> {
  const session: AuthSession = {
    user: {
      id: crypto.randomUUID(),
      email,
      name,
    },
  };

  if (isBrowser()) {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    );
  }

  return session;
}

export async function signOut(): Promise<void> {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}
export function getCookie(name: string): string | null {
    const nameLenPlus = name.length + 1;
    return (
        document.cookie
            .split(';')
            .map((c) => c.trim())
            .filter((cookie) => {
                return cookie.substring(0, nameLenPlus) === `${name}=`;
            })
            .map((cookie) => {
                return decodeURIComponent(cookie.substring(nameLenPlus));
            })[0] || null
    );
}

export function setCookie(
    name: string,
    value: string,
    days: number = 30,
    path: string = '/',
    sameSite: string = 'Strict'
): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = [
        `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
        `expires=${expires.toUTCString()}`,
        `path=${path}`,
        `SameSite=${sameSite}`,
    ].join('; ');
}

export function clearCookie(name: string, path: string = '/') {
    document.cookie = `${name}=; max-age=0; path=${path}`;
}

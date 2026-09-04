export function getErrorMessage(err: any): string | null {
    if (!err) return null;

    if (err.error && typeof err.error === 'string') {
        return err.error;
    }

    if (err.error && typeof err.error === 'object') {
        return err.error.details;
    }

    return null;
}

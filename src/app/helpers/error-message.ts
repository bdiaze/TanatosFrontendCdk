export function getErrorMessage(err: any): string | null {
    if (!err) return null;

    if (typeof err.error === 'string') {
        return err.error;
    }

    if (typeof err.error === 'object') {
        return err.error.details;
    }

    return null;
}

import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { finalize, Observable, share } from 'rxjs';

const inFlight = new Map<string, Observable<HttpEvent<unknown>>>();

export const dedupInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'GET') {
        return next(req);
    }

    const key = req.urlWithParams;
    if (inFlight.has(key)) {
        return inFlight.get(key)!;
    }

    const request$ = next(req).pipe(
        share(),
        finalize(() => inFlight.delete(key)),
    );

    inFlight.set(key, request$);
    return request$;
};

import { inject, Injector, runInInjectionContext } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, GuardResult, MaybeAsync, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { from, isObservable, Observable, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { CanActivateRunning } from '../services/can-activate-running';

export function chainActivateGuards(...guards: CanActivateFn[]): CanActivateFn {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
        const canActivateRunning = inject(CanActivateRunning);

        canActivateRunning.running.set(true);
        return chainGuards((guard) => guard(route, state), guards).pipe(finalize(() => canActivateRunning.running.set(false)));
    };
}

export function chainMatchGuards(...guards: CanMatchFn[]): CanMatchFn {
    return (route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> => {
        return chainGuards((guard) => guard(route, segments), guards);
    };
}

function chainGuards<T>(applyGuard: (guard: T) => MaybeAsync<GuardResult>, guards: T[]): Observable<GuardResult> {
    const injectionContext = inject(Injector);

    return guards.reduce(
        (acc, guard) =>
            acc.pipe(switchMap((result) => (result === true ? runInInjectionContext(injectionContext, () => toObservable(applyGuard(guard))) : of(result)))),
        of<GuardResult>(true),
    );
}

function toObservable<T>(input: MaybeAsync<T>) {
    return isObservable(input) ? input : input instanceof Promise ? from(input) : of(input);
}

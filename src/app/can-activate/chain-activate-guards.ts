import { inject, Injector, runInInjectionContext } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, GuardResult, MaybeAsync, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { from, isObservable, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function chainActivateGuards(...guards: CanActivateFn[]): CanActivateFn {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
        return chainGuards((guard) => guard(route, state), guards);
    };
}

export function chainMatchGuards(...guards: CanMatchFn[]): CanMatchFn {
    return (route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> => {
        return chainGuards((guard) => guard(route, segments), guards);
    };
}

function chainGuards<T>(applyGuard: (guard: T) => MaybeAsync<GuardResult>, guards: T[]): MaybeAsync<GuardResult> {
    const injectionContext = inject(Injector);

    return guards.reduce(
        (acc, guard) =>
            acc.pipe(switchMap((result) => (result === true ? runInInjectionContext(injectionContext, () => toObservable(applyGuard(guard))) : of(result)))),
        of(true) as Observable<GuardResult>,
    );
}

function toObservable<T>(input: MaybeAsync<T>) {
    return isObservable(input) ? input : input instanceof Promise ? from(input) : of(input);
}

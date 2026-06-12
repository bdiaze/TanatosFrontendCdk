import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { dedupInterceptor } from './dedup-interceptor';

describe('dedupInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => dedupInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });
});

import { TestBed } from '@angular/core/testing';

import { PaginaSinMenuEstaticoHelper } from './pagina-sin-menu-estatico-helper';

describe('OcultarMenuHelper', () => {
    let service: PaginaSinMenuEstaticoHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PaginaSinMenuEstaticoHelper);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

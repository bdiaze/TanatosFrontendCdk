import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminacion } from './modal-eliminacion';

describe('ModalEliminacion', () => {
    let component: ModalEliminacion;
    let fixture: ComponentFixture<ModalEliminacion>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalEliminacion],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalEliminacion);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

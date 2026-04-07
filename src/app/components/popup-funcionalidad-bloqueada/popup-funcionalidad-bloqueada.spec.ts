import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFuncionalidadBloqueada } from './popup-funcionalidad-bloqueada';

describe('PopupFuncionalidadBloqueada', () => {
  let component: PopupFuncionalidadBloqueada;
  let fixture: ComponentFixture<PopupFuncionalidadBloqueada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupFuncionalidadBloqueada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupFuncionalidadBloqueada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

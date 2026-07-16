import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaMensajes } from './consulta-mensajes';

describe('ConsultaMensajes', () => {
  let component: ConsultaMensajes;
  let fixture: ComponentFixture<ConsultaMensajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaMensajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaMensajes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreacionDestinatario } from './modal-creacion-destinatario';

describe('ModalCreacionDestinatario', () => {
  let component: ModalCreacionDestinatario;
  let fixture: ComponentFixture<ModalCreacionDestinatario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreacionDestinatario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreacionDestinatario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

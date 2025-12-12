import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarDestinatario } from './validar-destinatario';

describe('ValidarDestinatario', () => {
  let component: ValidarDestinatario;
  let fixture: ComponentFixture<ValidarDestinatario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidarDestinatario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarDestinatario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarWhatsapp } from './validar-whatsapp';

describe('ValidarWhatsapp', () => {
  let component: ValidarWhatsapp;
  let fixture: ComponentFixture<ValidarWhatsapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidarWhatsapp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidarWhatsapp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

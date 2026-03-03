import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappMensajes } from './whatsapp-mensajes';

describe('WhatsappMensajes', () => {
  let component: WhatsappMensajes;
  let fixture: ComponentFixture<WhatsappMensajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappMensajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappMensajes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

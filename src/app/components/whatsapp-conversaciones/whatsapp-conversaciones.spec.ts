import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappConversaciones } from './whatsapp-conversaciones';

describe('WhatsappConversaciones', () => {
  let component: WhatsappConversaciones;
  let fixture: ComponentFixture<WhatsappConversaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappConversaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappConversaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsWhatsapp } from './chats-whatsapp';

describe('ChatsWhatsapp', () => {
  let component: ChatsWhatsapp;
  let fixture: ComponentFixture<ChatsWhatsapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsWhatsapp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatsWhatsapp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEdicionTemplate } from './modal-edicion-template';

describe('ModalEdicionTemplate', () => {
  let component: ModalEdicionTemplate;
  let fixture: ComponentFixture<ModalEdicionTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEdicionTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEdicionTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

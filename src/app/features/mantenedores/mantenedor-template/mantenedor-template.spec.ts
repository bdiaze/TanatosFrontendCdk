import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTemplate } from './mantenedor-template';

describe('MantenedorTemplate', () => {
  let component: MantenedorTemplate;
  let fixture: ComponentFixture<MantenedorTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

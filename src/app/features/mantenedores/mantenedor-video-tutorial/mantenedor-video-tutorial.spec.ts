import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorVideoTutorial } from './mantenedor-video-tutorial';

describe('MantenedorVideoTutorial', () => {
  let component: MantenedorVideoTutorial;
  let fixture: ComponentFixture<MantenedorVideoTutorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorVideoTutorial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorVideoTutorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

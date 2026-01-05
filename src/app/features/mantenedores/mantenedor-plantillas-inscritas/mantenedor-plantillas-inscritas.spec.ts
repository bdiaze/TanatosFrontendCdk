import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorPlantillasInscritas } from './mantenedor-plantillas-inscritas';

describe('MantenedorPlantillasInscritas', () => {
  let component: MantenedorPlantillasInscritas;
  let fixture: ComponentFixture<MantenedorPlantillasInscritas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorPlantillasInscritas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorPlantillasInscritas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

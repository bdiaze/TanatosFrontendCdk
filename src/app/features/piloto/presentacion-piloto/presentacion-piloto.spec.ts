import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresentacionPiloto } from './presentacion-piloto';

describe('PresentacionPiloto', () => {
  let component: PresentacionPiloto;
  let fixture: ComponentFixture<PresentacionPiloto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentacionPiloto]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PresentacionPiloto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

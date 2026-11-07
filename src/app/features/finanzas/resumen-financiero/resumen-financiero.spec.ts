import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenFinanciero } from './resumen-financiero';

describe('ResumenFinanciero', () => {
  let component: ResumenFinanciero;
  let fixture: ComponentFixture<ResumenFinanciero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenFinanciero]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResumenFinanciero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

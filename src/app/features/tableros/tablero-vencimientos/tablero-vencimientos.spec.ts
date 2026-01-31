import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableroVencimientos } from './tablero-vencimientos';

describe('TableroVencimientos', () => {
  let component: TableroVencimientos;
  let fixture: ComponentFixture<TableroVencimientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableroVencimientos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableroVencimientos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInicial } from './menu-inicial';

describe('MenuInicial', () => {
  let component: MenuInicial;
  let fixture: ComponentFixture<MenuInicial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuInicial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuInicial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

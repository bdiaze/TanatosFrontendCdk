import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDeCookies } from './politica-de-cookies';

describe('PoliticaDeCookies', () => {
  let component: PoliticaDeCookies;
  let fixture: ComponentFixture<PoliticaDeCookies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaDeCookies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticaDeCookies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

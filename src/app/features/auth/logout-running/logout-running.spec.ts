import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutRunning } from './logout-running';

describe('LogoutRunning', () => {
  let component: LogoutRunning;
  let fixture: ComponentFixture<LogoutRunning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutRunning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutRunning);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

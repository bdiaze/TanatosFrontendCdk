import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTexto } from './editor-texto';

describe('EditorTexto', () => {
  let component: EditorTexto;
  let fixture: ComponentFixture<EditorTexto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTexto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorTexto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vlogs } from './vlogs';

describe('Vlogs', () => {
  let component: Vlogs;
  let fixture: ComponentFixture<Vlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Vlogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vlogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendance } from './add-attendance';

describe('AddAttendance', () => {
  let component: AddAttendance;
  let fixture: ComponentFixture<AddAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttendance],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAttendance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

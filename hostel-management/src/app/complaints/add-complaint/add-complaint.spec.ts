import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComplaint } from './add-complaint';

describe('AddComplaint', () => {
  let component: AddComplaint;
  let fixture: ComponentFixture<AddComplaint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddComplaint],
    }).compileComponents();

    fixture = TestBed.createComponent(AddComplaint);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

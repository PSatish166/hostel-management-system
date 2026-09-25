import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComplaint } from './edit-complaint';

describe('EditComplaint', () => {
  let component: EditComplaint;
  let fixture: ComponentFixture<EditComplaint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComplaint],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComplaint);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

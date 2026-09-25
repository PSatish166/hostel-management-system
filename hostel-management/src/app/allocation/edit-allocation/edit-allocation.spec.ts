import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAllocation } from './edit-allocation';

describe('EditAllocation', () => {
  let component: EditAllocation;
  let fixture: ComponentFixture<EditAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAllocation],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAllocation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

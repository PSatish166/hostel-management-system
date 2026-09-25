import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFee } from './edit-fee';

describe('EditFee', () => {
  let component: EditFee;
  let fixture: ComponentFixture<EditFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFee],
    }).compileComponents();

    fixture = TestBed.createComponent(EditFee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

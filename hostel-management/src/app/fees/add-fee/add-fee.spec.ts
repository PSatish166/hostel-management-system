import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFee } from './add-fee';

describe('AddFee', () => {
  let component: AddFee;
  let fixture: ComponentFixture<AddFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFee],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

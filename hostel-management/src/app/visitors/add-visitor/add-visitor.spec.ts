import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitor } from './add-visitor';

describe('AddVisitor', () => {
  let component: AddVisitor;
  let fixture: ComponentFixture<AddVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVisitor],
    }).compileComponents();

    fixture = TestBed.createComponent(AddVisitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitor } from './edit-visitor';

describe('EditVisitor', () => {
  let component: EditVisitor;
  let fixture: ComponentFixture<EditVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVisitor],
    }).compileComponents();

    fixture = TestBed.createComponent(EditVisitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

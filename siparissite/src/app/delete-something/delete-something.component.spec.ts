import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSomethingComponent } from './delete-something.component';

describe('DeleteSomethingComponent', () => {
  let component: DeleteSomethingComponent;
  let fixture: ComponentFixture<DeleteSomethingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSomethingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSomethingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

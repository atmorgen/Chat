import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnoreThisComponent } from './ignore-this.component';

describe('IgnoreThisComponent', () => {
  let component: IgnoreThisComponent;
  let fixture: ComponentFixture<IgnoreThisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgnoreThisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgnoreThisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

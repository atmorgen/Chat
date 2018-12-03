import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExpandComponent } from './user-expand.component';

describe('UserExpandComponent', () => {
  let component: UserExpandComponent;
  let fixture: ComponentFixture<UserExpandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserExpandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWindowComponent } from './users-window.component';

describe('UsersWindowComponent', () => {
  let component: UsersWindowComponent;
  let fixture: ComponentFixture<UsersWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

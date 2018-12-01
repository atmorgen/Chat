import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalJSONLibraryComponent } from './global-jsonlibrary.component';

describe('GlobalJSONLibraryComponent', () => {
  let component: GlobalJSONLibraryComponent;
  let fixture: ComponentFixture<GlobalJSONLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalJSONLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalJSONLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

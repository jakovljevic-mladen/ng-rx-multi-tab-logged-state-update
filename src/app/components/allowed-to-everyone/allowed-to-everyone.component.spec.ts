import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedToEveryoneComponent } from './allowed-to-everyone.component';

describe('AllowedToEveryoneComponent', () => {
  let component: AllowedToEveryoneComponent;
  let fixture: ComponentFixture<AllowedToEveryoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllowedToEveryoneComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedToEveryoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

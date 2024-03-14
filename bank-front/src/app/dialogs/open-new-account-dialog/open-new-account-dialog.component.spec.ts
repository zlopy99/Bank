import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNewAccountDialogComponent } from './open-new-account-dialog.component';

describe('OpenNewAccountDialogComponent', () => {
  let component: OpenNewAccountDialogComponent;
  let fixture: ComponentFixture<OpenNewAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenNewAccountDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenNewAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

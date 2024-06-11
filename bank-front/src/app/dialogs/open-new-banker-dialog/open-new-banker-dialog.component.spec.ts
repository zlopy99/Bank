import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNewBankerDialogComponent } from './open-new-banker-dialog.component';

describe('OpenNewBankerDialogComponent', () => {
  let component: OpenNewBankerDialogComponent;
  let fixture: ComponentFixture<OpenNewBankerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenNewBankerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenNewBankerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

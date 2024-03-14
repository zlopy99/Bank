import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNewClientDetailDialogComponent } from './open-new-client-detail-dialog.component';

describe('OpenNewClientDetailDialogComponent', () => {
  let component: OpenNewClientDetailDialogComponent;
  let fixture: ComponentFixture<OpenNewClientDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenNewClientDetailDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenNewClientDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

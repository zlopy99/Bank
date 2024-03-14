import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNewClientDialogComponent } from './open-new-client-dialog.component';

describe('OpenNewClientDialogComponent', () => {
  let component: OpenNewClientDialogComponent;
  let fixture: ComponentFixture<OpenNewClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenNewClientDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenNewClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

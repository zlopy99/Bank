import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLogComponent } from './client-log.component';

describe('ClientLogComponent', () => {
  let component: ClientLogComponent;
  let fixture: ComponentFixture<ClientLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

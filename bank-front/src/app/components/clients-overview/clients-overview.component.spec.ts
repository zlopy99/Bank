import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsOverviewComponent } from './clients-overview.component';

describe('ClientsOverviewComponent', () => {
  let component: ClientsOverviewComponent;
  let fixture: ComponentFixture<ClientsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientsOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankerDetailComponent } from './banker-detail.component';

describe('BankerDetailComponent', () => {
  let component: BankerDetailComponent;
  let fixture: ComponentFixture<BankerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankerDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

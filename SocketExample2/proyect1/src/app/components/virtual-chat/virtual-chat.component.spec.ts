import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualChatComponent } from './virtual-chat.component';

describe('VirtualChatComponent', () => {
  let component: VirtualChatComponent;
  let fixture: ComponentFixture<VirtualChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VirtualChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

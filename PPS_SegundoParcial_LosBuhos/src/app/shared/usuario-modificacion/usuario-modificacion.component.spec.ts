import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsuarioModificacionComponent } from './usuario-modificacion.component';

describe('UsuarioModificacionComponent', () => {
  let component: UsuarioModificacionComponent;
  let fixture: ComponentFixture<UsuarioModificacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioModificacionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

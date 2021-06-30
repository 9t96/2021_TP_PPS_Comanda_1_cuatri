import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl} from '@angular/forms'
import { Productos } from 'src/app/clases/productos';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';
import { Photo } from '@capacitor/camera';
@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.scss'],
})
export class AltaProductoComponent implements OnInit {


  public producto:Productos= new Productos();
  public currentUser: Usuario; //Datos de la sesion
  public productosList: Productos[]; //Toda las mesas que existen.
  public formProducto:FormGroup;
  
  imagenPerfil = "../../../assets/bulldog francés.jpg";
  uploadProgress:number;
  hasErrorProducto:boolean;

  constructor( private fb:FormBuilder , 
    private authService: AuthService ,
     public userSrv: UserService, 
     public prodSrv: ProductosService,
     private loadingController: LoadingController,
     private cameraService:CameraService,
     private storageService: StorageService) {
    this.producto= new Productos();
   }

  ngOnInit() {
    //  this.validarAltaProducto(this.formProducto);
    this.formProducto  = this.fb.group({
      'nombre': ['', [Validators.required ]],
      'descripcion': ['', [Validators.required ]],
      'tiempo': ['', [Validators.required ]],
      'precio': ['', [Validators.required ]],
      'sector': ['', [Validators.required ]]
    });
  }

  private validarAltaProducto(form:any){
 
  }

  GuardarNuevoProducto(){
    this.producto.nombre = this.formProducto.get('nombre').value;
    this.producto.descripcion =this.formProducto.get('descripcion').value;
    this.producto.tiempo_elaboracion  =this.formProducto.get('tiempo').value;
    this.producto.precio  =this.formProducto.get('precio').value;
    this.producto.sector  =this.formProducto.get('sector').value;
     

     var resp = this.prodSrv.GuardarNuevoProducto(this.producto)
    if(resp){
      console.log("Guardo y entro") 
      //exito al guardar
    }
    else{
      //error al guardar
    } 

    alert("Nuevo producto a guardar: " +this.producto.nombre + " " + this.producto.img_src);
  }
 
 
  tomarFotoProducto(){    
    this.addPhotoToGallery();
  }

  async addPhotoToGallery() {
    const photo = await this.cameraService.addNewToGallery();
    this.uploadPhoto(photo).then().catch((err) => {
      console.log(err);
    });
  }

  private async uploadPhoto(cameraPhoto: Photo) {    
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();
    
    const uploadTask = this.storageService.saveFile(blob, filePath);    

    uploadTask.then(async res =>{
      const downloadURL = await res.ref.getDownloadURL();
      this.producto.img_src = downloadURL;
      this.hasErrorProducto= false;
    })
    .catch((err)=>{
      console.log(err);
    });    
  }


  getFilePath(){
    return new Date().getTime() + '-test';
  }
}

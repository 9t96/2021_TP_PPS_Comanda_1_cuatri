import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Productos } from 'src/app/clases/productos';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { LoadingController, NavController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { StorageService } from 'src/app/services/storage.service';
import { Photo } from '@capacitor/camera';
//import { timingSafeEqual } from 'crypto';
import { Router } from '@angular/router';
@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.scss'],
})
export class AltaProductoComponent implements OnInit {


  public producto: Productos;
  public currentUser: Usuario; //Datos de la sesion
  public productosList: Productos[]; //Toda las mesas que existen.
  public formProducto: FormGroup;
  public i_NroImagen: number = 0;
  public imagenPerfil = "../../../assets/plato.png";
  public errorImagen: boolean;
  public uploadProgress: number;
  public mostrar = true;
  public habilitarFotosBTN = false;

  constructor(private fb: FormBuilder,
    private route: Router,
    private authService: AuthService,
    public userSrv: UserService,
    public prodSrv: ProductosService,
    private loadingController: LoadingController,
    private cameraService: CameraService,
    private storageService: StorageService,
    public navCtrl: NavController) {

  }

  navigateBack(){
    this.navCtrl.back();
  }
  ngOnInit() {
    this.producto = new Productos();
    this.producto.img_src = new Array();
    //  this.validarAltaProducto(this.formProducto);
    this.formProducto = this.fb.group({
      'nombre': ['', [Validators.required]],
      'descripcion': ['', [Validators.required]],
      'tiempo': ['', [Validators.required]],
      'precio': ['', [Validators.required]],
      'sector': ['', [Validators.required]]
    });
    /*if(this.validarCantidadFotos()){
      this.habilitarFotosBTN= true;
    }*/

  }

  private validarCantidadFotos(): boolean {
    this.errorImagen = (this.i_NroImagen == 3) ? false : true;
    return this.errorImagen;
  }
 
  GuardarNuevoProducto() {
    this.producto.nombre = this.formProducto.get('nombre').value;
    this.producto.descripcion = this.formProducto.get('descripcion').value;
    this.producto.tiempo_elaboracion = this.formProducto.get('tiempo').value;
    this.producto.precio = this.formProducto.get('precio').value;
    if (!this.validarCantidadFotos()) {//las imagenes son 3
      this.errorImagen = false;
      var resp = this.prodSrv.GuardarNuevoProducto(this.producto)
      if (resp) {
        console.log("Producto guardado con exito");
        //exito al guardar
        this.route.navigate(['/home-cocinero']);
      }
      else {
        console.log("error al guardar el nuevo producto ");
      }
    } else {
      //mostrar el error de las imagenes
      this.errorImagen = true;
      console.log("FALTAN LAS FOTOS");
    }

  }



  tomarFotoProducto() {
    if (this.i_NroImagen <3 ) {
      this.addPhotoToGallery();
    }
  }

  async addPhotoToGallery() {
    const photo = await this.cameraService.addNewToGallery();
    this.uploadPhoto(photo).then().catch((err) => {
      console.log("Error addPhotoToGallery", err);
    });
  }

  private async uploadPhoto(cameraPhoto: Photo) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    const filePath = this.getFilePath();

    const uploadTask = this.storageService.saveFile(blob, filePath);

    uploadTask.then(async res => {
      const downloadURL = await res.ref.getDownloadURL();
      if (downloadURL.length > 0) {
        this.producto.img_src.push(downloadURL);

        this.i_NroImagen++;  
      } else {
        alert("IMAGEN NO CORRECTA . NO SE CONTABILIZA " + this.i_NroImagen);
      }

      this.validarCantidadFotos();
    })
      .catch((err) => {
        console.log("Error al subbir la imagen: ", err);
      });

      if(this.i_NroImagen==3){
        this.mostrar= false;
      }
  }


  getFilePath() {
    return new Date().getTime() + '-test';
  }
}

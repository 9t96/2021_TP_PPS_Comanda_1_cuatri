import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {

  clientes:any[];

  constructor(private userService:UserService) { }

  ngOnInit() {
    this.userService.getClientesByStatus(false)
    .then((querySnapshot)=>{      
      this.clientes = querySnapshot.docs.map(d => {
        return {
          id:d.id,
          user:d.data()
        };
      });
      console.log(this.clientes);           
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{

    })
  }

  saveUser(item:any){
    this.userService.setItemWithId(item.user, item.id)
  }
}

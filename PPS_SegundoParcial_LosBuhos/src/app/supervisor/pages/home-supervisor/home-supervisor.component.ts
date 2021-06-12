import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.component.html',
  styleUrls: ['./home-supervisor.component.scss'],
})
export class HomeSupervisorComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

  goToRegister(){
    this.router.navigate(['supervisor/register']);
  }

  goToClientes(){
    this.router.navigate(['supervisor/clientes']);
  }

}

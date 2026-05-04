import { Component, signal } from '@angular/core';
import { Github } from '../../servicios/github';
import { OnInit } from '@angular/core';



@Component({
  selector: 'app-quiensoy',
  imports: [],
  standalone: true,
  templateUrl: './quiensoy.html',
  styleUrl: './quiensoy.css',
})
export class Quiensoy implements OnInit {

  DatosAlumno = signal <any>(null);

  constructor(private github: Github){}

  ngOnInit(){
    this.obtenerDatosGithub();
  }

  obtenerDatosGithub(){
    this.github.obtenerDatosGithub().subscribe((data:any)=>{
      this.DatosAlumno.set(data);
    })
  }
}

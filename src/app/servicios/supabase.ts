import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({providedIn: 'root',})

export class Supabase {

    clienteSupabase: SupabaseClient;

    constructor(private router:Router){
        this.clienteSupabase = createClient('https://rrwzxuskgfxsmndzearn.supabase.co','sb_publishable_eRa-DCn1C6gFQhLZnXPC6Q_BUHBKdE9z');
    }

    // AUTH
    async registrar(correo: string, clave: string, nombre: string, edad: number,apellido: string){
        const { data, error } = await this.clienteSupabase.auth.signUp({
        email: correo,
        password: clave,
        });
    if (data.user) {
    this.guardarDatosUsuario(data.user.id, correo, nombre,apellido,edad);
    }

    }

    iniciarSesion(correo: string, clave:string){
        return this.clienteSupabase.auth.signInWithPassword({
        email: correo,
        password: clave,
        });
    }

    // BASE DE DATOS 

    guardarDatosUsuario(uid: string,correoUsuario: string, usuarioNombre: string,usuarioApellido: string,  usuarioEdad:number){
        this.clienteSupabase.from('usuariosTabla').insert([
        {email:correoUsuario,nombre: usuarioNombre, edad: usuarioEdad, apellido: usuarioApellido, uid:uid}
        ]).then(({ data, error }) => {
        if(error){
            console.error('Error: ',error.message);
        }else{
            this.router.navigate(['/home']);
        }
        });
    }

    obtenerDatosUsuario(){
        return this.clienteSupabase.from('usuariosTabla').select('*');
    }

}

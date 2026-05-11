import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({providedIn: 'root',})

export class Supabase {

    clienteSupabase: SupabaseClient;

    constructor(private router:Router){
        this.clienteSupabase = createClient('https://rrwzxuskgfxsmndzearn.supabase.co','sb_publishable_eRa-DCn1C6gFQhLZnXPC6Q_BUHBKdE9');
    }

    // AUTH
    async registrar(correo: string, clave: string){
        return await this.clienteSupabase.auth.signUp({
        email: correo,
        password: clave,
        });

    }

    iniciarSesion(correo: string, clave:string){
        return this.clienteSupabase.auth.signInWithPassword({
        email: correo,
        password: clave,
        });
    }

    // BASE DE DATOS 

    async guardarDatosUsuario(uid: string,correoUsuario: string, usuarioNombre: string,usuarioApellido: string,  usuarioEdad:number){
        const {data,error} = await this.clienteSupabase.from('usuariosTabla').insert([
            {
            uid: uid,
            email: correoUsuario,
            nombre: usuarioNombre,
            apellido: usuarioApellido,
            edad: usuarioEdad
            }
    ]);

        if(error){
            console.error('Error al guardar datos del usuario: ', error.message);
        }
        return data;

    }

    obtenerDatosUsuario(){
        return this.clienteSupabase.from('usuariosTabla').select('*');
    }
    
    async guardarResultadoJuego(juego: string, gano: boolean, puntaje: number, tiempo: number, detalles: any) {
    const { data: { session } } = await this.clienteSupabase.auth.getSession();
    
    if (session) {
        const { error } = await this.clienteSupabase
        .from('resultados_juegos')
        .insert({
            user_id: session.user.id,
            email: session.user.email,
            juego: juego,
            gano: gano,
            puntaje: puntaje,
            tiempo_segundos: tiempo,
            detalles: detalles
        });

        if (error) {
        console.error("Error al guardar en Supabase:", error);
        } else {
        console.log(`¡Resultado de ${juego} guardado con éxito!`);
        }
    }
    }
}

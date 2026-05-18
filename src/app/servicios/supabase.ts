import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({providedIn: 'root',})

export class Supabase {

    clienteSupabase: SupabaseClient;

    constructor(private router:Router){
        this.clienteSupabase = createClient('https://rrwzxuskgfxsmndzearn.supabase.co','sb_publishable_eRa-DCn1C6gFQhLZnXPC6Q_BUHBKdE9');
    }

    // ==================== AUTENTICACION ====================
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

    // ==================== USUARIOS ====================

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

    // ==================== RESULTADOS DE JUEGOS ====================
    async guardarResultadoJuego(juego: string, gano: boolean, puntaje: number, tiempo: number, detalles: any) {
    const { data: { session } } = await this.clienteSupabase.auth.getSession();
    
    if (session) {
        const { error } = await this.clienteSupabase.from('resultados_juegos').insert({
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

    // ========================= CHAT =========================
    // -- con el comando supabse_realtime se creo una tabla que con cada insert emite un evento que escuchamos en el frontend para mostrar los mensajes nuevos sin necesidad de refrescar la página ---
    // --- Trae los mensajes anteriores al entrar a la sala---
    async obtenerHistorialChat() {
    const { data, error } = await this.clienteSupabase.from('chat').select('*').order('fecha', { ascending: true }); // Ordena del más viejo al más nuevo
    
    if (error) throw error;
    return data;
    }

    // --- Guarda un mensaje nuevo ---
    async enviarMensajeChat(usuarioEmail: string, textoMensaje: string) {
    const { error } = await this.clienteSupabase.from('chat').insert([{ usuario: usuarioEmail, mensaje: textoMensaje }]);
    
    if (error) throw error;
    }

    // --- se queda "escuchando" en tiempo real ---
    suscribirseAlChat(callback: (payload: any) => void) {
    return this.clienteSupabase.channel('chat_publico').on('postgres_changes',{ event: 'INSERT', schema: 'public', table: 'chat' }, // Solo escuchamos cuando se INSERTA un mensaje
        (payload) => {
            callback(payload.new); // Devolvemos el mensaje nuevo al componente
        }).subscribe();
    }

    async obtenerUsuarioLogueado(){
        const {data} = await this.clienteSupabase.auth.getUser();
        return data.user;
    }

}

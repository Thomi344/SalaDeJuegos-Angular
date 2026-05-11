import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Supabase } from '../servicios/supabase';

export const authGuardGuard: CanActivateFn = async (route, state) => {
  // Inyectamos los servicios necesarios directamente en la función
  const supabase = inject(Supabase);
  const router = inject(Router);

  // Verificamos si hay una sesión activa en Supabase
  const { data: { session } } = await supabase.clienteSupabase.auth.getSession();

  if (session) {
    // Si hay sesión, lo dejamos pasar a la ruta
    return true;
  } else {
    // Si no hay sesión, lo pateamos de vuelta al login
    router.navigate(['/login']);
    return false;
  }
};
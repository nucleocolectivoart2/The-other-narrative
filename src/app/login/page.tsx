"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  Eye, 
  EyeOff, 
  ChevronLeft,
  Info
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup,
  browserPopupBlockedHandler
} from 'firebase/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setIsLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      router.push('/admin');
    } catch (err: any) {
      console.error("Auth Error:", err);
      const code = err?.code || '';
      
      if (code === 'auth/operation-not-allowed') {
        setError('El método de inicio de sesión no está habilitado en Firebase. Actívalo en la consola.');
      } else if (code === 'auth/invalid-credential' || code === 'auth/invalid-email' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Las credenciales son incorrectas o el usuario no existe.');
      } else if (code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil (mínimo 6 caracteres).');
      } else if (code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Intenta más tarde.');
      } else {
        setError(err?.message || 'Ocurrió un error en la autenticación. Intenta de nuevo.');
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    
    setIsGoogleLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      router.push('/admin');
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      const code = err?.code || '';
      
      if (code === 'auth/popup-blocked') {
        setError('El navegador bloqueó la ventana emergente. Por favor, permite los popups para este sitio.');
      } else if (code === 'auth/cancelled-popup-request') {
        setError('Operación cancelada.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('El proveedor de Google no está habilitado en Firebase.');
      } else {
        setError('No se pudo iniciar sesión con Google. Intenta con correo y contraseña.');
      }
      setIsGoogleLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="w-full max-w-md z-10 space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="flex justify-center mb-8">
          <Link href="/" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
          </Link>
        </div>

        <div className="bg-white rounded-sm shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 border border-border/40 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/5 text-secondary mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold font-headline tracking-tighter uppercase">
              {isLoginMode ? 'Panel Editorial' : 'Crear Cuenta'}
            </h1>
            <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-[0.3em] pb-4">
              Gestión de Narrativas
            </p>
          </div>

          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              disabled={isGoogleLoading || isLoading}
              className="w-full h-12 rounded-sm border-border hover:bg-muted text-[10px] font-bold uppercase tracking-widest gap-3 transition-all"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continuar con Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
              <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-[0.4em] text-muted-foreground/40">
                <span className="bg-white px-4">O correo</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[9px] font-bold uppercase tracking-widest opacity-60">Correo</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="h-12 rounded-sm bg-muted/20" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[9px] font-bold uppercase tracking-widest opacity-60">Contraseña</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 rounded-sm bg-muted/20 pr-12" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] bg-secondary hover:bg-primary transition-all duration-500" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isLoginMode ? 'Acceder' : 'Registrarse'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  {isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Accede'}
                </button>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-sm border-destructive/20 bg-destructive/5 py-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <div className="space-y-2">
                      <AlertDescription className="text-[10px] font-medium leading-relaxed">{error}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
            </form>
          </div>
        </div>

        <p className="text-center text-[8px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-40">
          Uso restringido a personal autorizado © {year || ''}
        </p>
      </div>
    </div>
  );
}

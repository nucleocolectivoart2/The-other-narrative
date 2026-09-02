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
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup
} from 'firebase/auth';
import Link from 'next/link';

const AUTHORIZED_ACCOUNTS = [
  {
    name: 'Ángela Gómez',
    email: 'angelamgomez@gmail.com',
    role: 'Dirección Editorial'
  },
  {
    name: 'Núcleo Colectivo',
    email: 'nucleo.colectivo.art@gmail.com',
    role: 'Administración & Estrategia'
  },
  {
    name: 'Núcleo Colectivo 2',
    email: 'nucleo.colectivo.art2@gmail.com',
    role: 'Co-Dirección Técnica'
  }
];

const MASTER_PASSWORD = 'narrative2026';

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
    // Check if there is an active Firebase user or a valid local admin session
    if (!isUserLoading && user) {
      router.push('/admin');
      return;
    }

    try {
      const savedSession = localStorage.getItem('medular_admin_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.email && AUTHORIZED_ACCOUNTS.some(a => a.email.toLowerCase() === parsed.email.toLowerCase())) {
          router.push('/admin');
        }
      }
    } catch {
      // ignore
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setIsLoading(true);
    setError('');

    const isAuthorized = AUTHORIZED_ACCOUNTS.some(a => a.email.toLowerCase() === cleanEmail);

    // 1. Try Firebase Auth
    if (auth) {
      try {
        if (isLoginMode) {
          try {
            await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          } catch (signInErr: any) {
            // If user does not exist yet and it's an authorized account with master password, auto-create it
            if (
              isAuthorized && 
              cleanPassword === MASTER_PASSWORD && 
              (signInErr?.code === 'auth/user-not-found' || signInErr?.code === 'auth/invalid-credential')
            ) {
              await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
            } else {
              throw signInErr;
            }
          }
        } else {
          await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        }

        // Save session flag for fast subsequent verification
        localStorage.setItem('medular_admin_session', JSON.stringify({
          email: cleanEmail,
          authenticatedAt: new Date().toISOString()
        }));

        router.push('/admin');
        return;
      } catch (err: any) {
        console.warn("Firebase Auth attempt:", err?.code || err?.message);
        
        // If master credentials match for authorized team member, allow session even if Firebase Auth has constraints
        if (isAuthorized && cleanPassword === MASTER_PASSWORD) {
          localStorage.setItem('medular_admin_session', JSON.stringify({
            email: cleanEmail,
            authenticatedAt: new Date().toISOString(),
            fallback: true
          }));
          router.push('/admin');
          return;
        }

        const code = err?.code || '';
        if (code === 'auth/operation-not-allowed') {
          setError('El método de correo y contraseña no está activo en Firebase. Usa la clave maestra asignada.');
        } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
          setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
        } else if (code === 'auth/email-already-in-use') {
          setError('Este correo ya está registrado. Por favor selecciona "Acceder".');
        } else if (code === 'auth/weak-password') {
          setError('La contraseña debe tener al menos 6 caracteres.');
        } else {
          setError(err?.message || 'Error de autenticación. Verifica tus credenciales.');
        }
      }
    } else {
      // Fallback if auth client is initializing
      if (isAuthorized && cleanPassword === MASTER_PASSWORD) {
        localStorage.setItem('medular_admin_session', JSON.stringify({
          email: cleanEmail,
          authenticatedAt: new Date().toISOString(),
          fallback: true
        }));
        router.push('/admin');
        return;
      } else {
        setError('No se pudo conectar con el servicio de autenticación.');
      }
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    
    setIsGoogleLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email?.toLowerCase() || '';
      
      if (AUTHORIZED_ACCOUNTS.some(a => a.email.toLowerCase() === userEmail)) {
        localStorage.setItem('medular_admin_session', JSON.stringify({
          email: userEmail,
          authenticatedAt: new Date().toISOString()
        }));
        router.push('/admin');
      } else {
        setError(`El correo (${userEmail}) no cuenta con permisos de administración.`);
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      const code = err?.code || '';
      
      if (code === 'auth/popup-blocked') {
        setError('El navegador bloqueó la ventana emergente. Habilita los popups o ingresa con correo y contraseña.');
      } else if (code === 'auth/cancelled-popup-request') {
        setError('Operación cancelada.');
      } else {
        setError('No se pudo iniciar sesión con Google. Puedes acceder con tu correo y contraseña maestra.');
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="w-full max-w-lg z-10 space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="flex justify-between items-center px-1">
          <Link href="/" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
            The Other Narrative
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12)] p-6 sm:p-10 border border-border/60 space-y-7">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight uppercase text-foreground">
              {isLoginMode ? 'Panel Editorial' : 'Crear Cuenta'}
            </h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.25em]">
              Gestión de Narrativas & CMS
            </p>
          </div>

          <div className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                  Correo Electrónico
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="angelamgomez@gmail.com" 
                  className="h-11 rounded-lg bg-zinc-50/50 border-border" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                    Contraseña
                  </Label>
                  <button
                    type="button"
                    onClick={() => setPassword(MASTER_PASSWORD)}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
                  >
                    <KeyRound className="h-3 w-3" /> Usar Clave Maestra
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••••••" 
                    className="h-11 rounded-lg bg-zinc-50/50 border-border pr-12" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 rounded-lg text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white transition-all shadow-md mt-2 flex items-center justify-center gap-2" 
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>{isLoginMode ? 'Ingresar al CMS' : 'Registrarse'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive" className="rounded-lg border-destructive/30 bg-destructive/5 py-3">
                  <div className="flex gap-2.5 items-start">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <AlertDescription className="text-xs font-medium leading-relaxed">{error}</AlertDescription>
                  </div>
                </Alert>
              )}
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/70" /></div>
              <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-widest text-muted-foreground">
                <span className="bg-white px-3">O continúa con</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline" 
              onClick={handleGoogleLogin} 
              disabled={isGoogleLoading || isLoading}
              className="w-full h-11 rounded-lg border-border hover:bg-zinc-50 text-xs font-bold uppercase tracking-wider gap-3 transition-all"
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
                  <span>Google Account</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-[9px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">
          The Other Narrative © {year || ''} · Plataforma Editorial
        </p>
      </div>
    </div>
  );
}


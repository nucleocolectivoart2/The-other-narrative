
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LogOut, 
  Plus, 
  Sparkles, 
  Radio, 
  Loader2, 
  Send,
  ShieldAlert,
  BookOpen,
  Trash2,
  Type,
  Quote as QuoteIcon,
  Pencil,
  Heading3,
  ChevronDown,
  ChevronUp,
  Bold,
  Italic,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Video,
  Briefcase,
  Quote,
  ExternalLink,
  Mail,
  CheckCircle,
  Clock,
  Wand2,
  Copy,
  Layout,
  Eye,
  FileText,
  ToggleLeft,
  ToggleRight,
  Check,
  Sliders,
  Globe,
  Compass,
  Film,
  RotateCcw,
  Share2,
  Play,
  FileDown,
  BarChart3,
  Layers,
  EyeOff
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, deleteDoc, query, orderBy, updateDoc, setDoc } from 'firebase/firestore';
import { defaultSiteSettings, SiteSettings, extractYouTubeId } from '@/lib/default-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface EditorialOutput {
  refinedText: string;
  keyMessages: string[];
  regenerativeInsight: string;
}

const AUTHORIZED_EMAILS = [
  'angelamgomez@gmail.com', 
  'nucleo.colectivo.art@gmail.com', 
  'nucleo.colectivo.art2@gmail.com'
];

type BlockType = 'title' | 'text' | 'quote';
type Alignment = 'left' | 'center' | 'right' | 'justify';

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  alignment: Alignment;
}

function EditableBlock({ 
  block, 
  onChange, 
  onRemove, 
  onMove 
}: { 
  block: ContentBlock; 
  onChange: (content: string, alignment: Alignment) => void;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML, block.alignment);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML, block.alignment);
    }
  };

  const setAlignment = (align: Alignment) => {
    onChange(block.content, align);
  };

  return (
    <div className="group relative bg-white border border-border/40 rounded-sm p-8 shadow-sm hover:shadow-xl transition-all duration-500 mb-8">
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white border" onClick={() => onMove('up')}><ChevronUp className="h-4" /></Button>
        <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-lg" onClick={onRemove}><Trash2 className="h-3.5" /></Button>
        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white border" onClick={() => onMove('down')}><ChevronDown className="h-4" /></Button>
      </div>

      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <div className="bg-[#FAF7F2] text-primary px-4 py-1.5 rounded-full flex items-center gap-2 border border-primary/10">
          <Type className="h-3 w-3" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
            {block.type === 'title' ? 'TÍTULO' : block.type === 'quote' ? 'CITA' : 'PÁRRAFO'}
          </span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => execCommand('bold')} title="Negrita"><Bold className="h-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => execCommand('italic')} title="Cursiva"><Italic className="h-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => execCommand('backColor', '#FFF9C4')} title="Resaltar"><Highlighter className="h-3.5" /></Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button variant={block.alignment === 'left' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setAlignment('left')}><AlignLeft className="h-3.5" /></Button>
          <Button variant={block.alignment === 'center' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setAlignment('center')}><AlignCenter className="h-3.5" /></Button>
          <Button variant={block.alignment === 'right' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setAlignment('right')}><AlignRight className="h-3.5" /></Button>
          <Button variant={block.alignment === 'justify' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setAlignment('justify')}><AlignJustify className="h-3.5" /></Button>
        </div>
      </div>

      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: block.content }}
        className={cn(
          "outline-none min-h-[40px] transition-all duration-300",
          block.type === 'title' && "text-2xl font-headline font-bold tracking-tight",
          block.type === 'quote' && "text-xl italic font-headline border-l-4 border-primary pl-6 py-2 bg-muted/10",
          block.type === 'text' && "text-base font-light leading-relaxed",
          block.alignment === 'left' && "text-left",
          block.alignment === 'center' && "text-center",
          block.alignment === 'right' && "text-right",
          block.alignment === 'justify' && "text-justify"
        )}
      />
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const firestore = useFirestore();

  const adminDocRef = useMemoFirebase(() => user ? doc(firestore, 'adminRoles', user.uid) : null, [firestore, user]);
  const { data: adminData, isLoading: isAdminLoading } = useDoc(adminDocRef);

  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isSessionChecking, setIsSessionChecking] = useState(true);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('medular_admin_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.email) {
          setSessionEmail(parsed.email.toLowerCase());
        }
      }
    } catch {
      // ignore
    } finally {
      setIsSessionChecking(false);
    }
  }, []);

  const effectiveEmail = (user?.email || sessionEmail || '').toLowerCase();
  const isAuthorized = adminData?.isAdmin || (effectiveEmail && AUTHORIZED_EMAILS.some(e => e.toLowerCase() === effectiveEmail));

  // Sincronización automática de sesión de Firebase Auth en recargas de página
  useEffect(() => {
    if (!isUserLoading && !user && sessionEmail && auth) {
      if (AUTHORIZED_EMAILS.some(e => e.toLowerCase() === sessionEmail.toLowerCase())) {
        signInWithEmailAndPassword(auth, sessionEmail, 'narrative2026').catch(() => {
          createUserWithEmailAndPassword(auth, sessionEmail, 'narrative2026').catch(() => {});
        });
      }
    }
  }, [user, isUserLoading, sessionEmail, auth]);

  const [activeTab, setActiveTab] = useState('overview');
  const [activeForm, setActiveForm] = useState<'none' | 'podcast' | 'project' | 'blog' | 'video' | 'testimonial' | 'resource'>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState<EditorialOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogType, setBlogType] = useState('Reflexión');
  const [blogStatus, setBlogStatus] = useState<'published' | 'draft'>('published');
  const [blogFilterStatus, setBlogFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [blogImage, setBlogImage] = useState('');
  const [blogAuthorName, setBlogAuthorName] = useState('Ángela María Gómez Duque');
  const [blogAuthorTitle, setBlogAuthorTitle] = useState('Periodista experta en regeneración');
  const [blocks, setBlocks] = useState<ContentBlock[]>([{ id: 'init-1', type: 'text', content: '', alignment: 'justify' }]);

  const [podTitle, setPodTitle] = useState('');
  const [podDescription, setPodDescription] = useState('');
  const [podUrl, setPodUrl] = useState('');
  const [podGuest, setPodGuest] = useState('');
  const [podImage, setPodImage] = useState('');
  const [podStatus, setPodStatus] = useState<'published' | 'draft'>('published');

  const [vidTitle, setVidTitle] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const [vidPlatform, setVidPlatform] = useState('YouTube');
  const [vidDescription, setVidDescription] = useState('');
  const [vidImage, setVidImage] = useState('');
  const [vidStatus, setVidStatus] = useState<'published' | 'draft'>('published');

  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState('');
  const [projImage, setProjImage] = useState('');
  const [projLink, setProjLink] = useState('');
  const [projStatus, setProjStatus] = useState<'published' | 'draft'>('published');

  const [testQuote, setTestQuote] = useState('');
  const [testAuthorName, setTestAuthorName] = useState('');
  const [testAuthorTitle, setTestAuthorTitle] = useState('');
  const [testStatus, setTestStatus] = useState<'published' | 'draft'>('published');

  // Estados para Recursos Descargables
  const [resTitle, setResTitle] = useState('');
  const [resDescription, setResDescription] = useState('');
  const [resCategory, setResCategory] = useState('Toolkit');
  const [resFormat, setResFormat] = useState('PDF Editorial');
  const [resPages, setResPages] = useState('');
  const [resDownloadUrl, setResDownloadUrl] = useState('');
  const [resCoverImage, setResCoverImage] = useState('');
  const [resStatus, setResStatus] = useState<'published' | 'draft'>('published');

  const blogQuery = useMemoFirebase(() => query(collection(firestore, 'contentItems'), orderBy('date', 'desc')), [firestore]);
  const { data: blogItems } = useCollection(blogQuery);
  const resourcesQuery = useMemoFirebase(() => query(collection(firestore, 'resources'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: resourceItems } = useCollection(resourcesQuery);
  const podcastQuery = useMemoFirebase(() => query(collection(firestore, 'podcasts'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: podItems } = useCollection(podcastQuery);
  const videoQuery = useMemoFirebase(() => query(collection(firestore, 'featuredVideos'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: videoItems } = useCollection(videoQuery);
  const projectsQuery = useMemoFirebase(() => query(collection(firestore, 'projects')), [firestore]);
  const { data: projectItems } = useCollection(projectsQuery);
  const testimonialsQuery = useMemoFirebase(() => query(collection(firestore, 'testimonials')), [firestore]);
  const { data: testimonialItems } = useCollection(testimonialsQuery);
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user || !isAuthorized) return null;
    return query(collection(firestore, 'messages'), orderBy('createdAt', 'desc'));
  }, [firestore, user, isAuthorized]);
  const { data: messageItems } = useCollection(messagesQuery);

  // Configurador Global del Ecosistema
  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'siteSettings', 'general');
  }, [firestore]);
  const { data: remoteSettingsData } = useDoc<Partial<SiteSettings>>(settingsDocRef);

  const [ecosystemSettings, setEcosystemSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [isSavingEcosystem, setIsSavingEcosystem] = useState(false);
  const [hasInitializedEcosystem, setHasInitializedEcosystem] = useState(false);

  useEffect(() => {
    if (remoteSettingsData && !hasInitializedEcosystem) {
      const initialVideos = (remoteSettingsData.featuredVideos && remoteSettingsData.featuredVideos.length > 0)
        ? remoteSettingsData.featuredVideos
        : defaultSiteSettings.featuredVideos;

      setEcosystemSettings({
        ...defaultSiteSettings,
        ...remoteSettingsData,
        featuredVideos: initialVideos.map(v => {
          if ((v.id === '0DmyalU2zL4' || v.youtubeId === '0DmyalU2zL4') && (!v.title || v.title.includes('HAY FESTIVAL') || v.title === 'Diálogos de Cambio')) {
            return { ...v, title: 'COP 16' };
          }
          return v;
        })
      });
      setHasInitializedEcosystem(true);
    }
  }, [remoteSettingsData, hasInitializedEcosystem]);

  const saveEcosystemSettings = async () => {
    if (!firestore) return;
    setIsSavingEcosystem(true);
    try {
      const sanitized = {
        ...ecosystemSettings,
        heroVideoId: extractYouTubeId(ecosystemSettings.heroVideoId),
        featuredVideos: ecosystemSettings.featuredVideos.map(v => ({
          ...v,
          youtubeId: extractYouTubeId(v.youtubeId)
        })),
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(firestore, 'siteSettings', 'general'), sanitized, { merge: true });
      setEcosystemSettings(sanitized);
      toast({
        title: "¡Configuración Guardada!",
        description: "El ecosistema global y la portada se han sincronizado con éxito.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: err?.message || "No se pudieron sincronizar los cambios de configuración.",
      });
    } finally {
      setIsSavingEcosystem(false);
    }
  };

  const resetEcosystemDefaults = () => {
    if (window.confirm("¿Restablecer todos los textos, videos y enlaces del ecosistema a sus valores originales de The Other Narrative?")) {
      setEcosystemSettings(defaultSiteSettings);
      toast({
        title: "Valores restablecidos en el formulario",
        description: "Haz clic en 'Guardar Configuración' para aplicar los cambios a la plataforma.",
      });
    }
  };

  useEffect(() => {
    if (!isUserLoading && !isSessionChecking && !user && !sessionEmail) {
      router.push('/login');
    }
  }, [user, isUserLoading, isSessionChecking, sessionEmail, router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('medular_admin_session');
    } catch {
      // ignore
    }
    if (auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  const addBlock = (type: BlockType) => {
    setBlocks([...blocks, { id: Math.random().toString(36).substr(2, 9), type, content: '', alignment: type === 'text' ? 'justify' : 'left' }]);
  };

  const updateBlock = (id: string, content: string, alignment: Alignment) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content, alignment } : b));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setBlogTitle(''); setBlogExcerpt(''); setBlogType('Reflexión'); setBlogImage('');
    setBlogStatus('published');
    setBlocks([{ id: 'reset', type: 'text', content: '', alignment: 'justify' }]);
    setPodTitle(''); setPodDescription(''); setPodUrl(''); setPodGuest(''); setPodImage(''); setPodStatus('published');
    setVidTitle(''); setVidUrl(''); setVidPlatform('YouTube'); setVidDescription(''); setVidImage(''); setVidStatus('published');
    setProjTitle(''); setProjDesc(''); setProjCategory(''); setProjImage(''); setProjLink(''); setProjStatus('published');
    setTestQuote(''); setTestAuthorName(''); setTestAuthorTitle(''); setTestStatus('published');
    setResTitle(''); setResDescription(''); setResCategory('Toolkit'); setResFormat('PDF Editorial'); setResPages(''); setResDownloadUrl(''); setResCoverImage(''); setResStatus('published');
    setActiveForm('none');
  };

  const deleteBlogPost = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta crónica? Esta acción retirará el contenido de la Bitácora.")) return;
    try {
      await deleteDoc(doc(firestore, 'contentItems', id));
      toast({ title: "Crónica Eliminada", description: "El artículo fue removido de la base de datos." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al eliminar", description: err?.message || "No se pudo eliminar la crónica." });
    }
  };

  const toggleArticleStatus = async (id: string, currentStatus: string = 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      await updateDoc(doc(firestore, 'contentItems', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      toast({
        title: newStatus === 'published' ? "Crónica Publicada" : "Movida a Borrador",
        description: newStatus === 'published' 
          ? "El artículo ya está visible en la Bitácora pública." 
          : "El artículo ahora está reservado como borrador interno."
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar estado",
        description: err?.message || "No se pudo cambiar el estado."
      });
    }
  };

  const saveBlogPost = (targetStatus?: 'published' | 'draft') => {
    if (!blogTitle) {
      toast({ variant: "destructive", title: "Error", description: "El título es obligatorio." });
      return;
    }
    const finalStatus = targetStatus || blogStatus;
    setIsSaving(true);
    const htmlBody = blocks.map(block => {
      const alignClass = `text-${block.alignment}`;
      if (block.type === 'title') return `<h3 class="${alignClass}">${block.content}</h3>`;
      if (block.type === 'quote') return `<blockquote class="${alignClass}">${block.content}</blockquote>`;
      return `<p class="${alignClass}">${block.content}</p>`;
    }).join('\n');
    const slug = blogTitle.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const data = {
      title: blogTitle,
      excerpt: blogExcerpt || '...',
      body: htmlBody,
      type: blogType,
      status: finalStatus,
      image: blogImage || 'https://picsum.photos/seed/blog/1200/800',
      authorName: blogAuthorName,
      authorTitle: blogAuthorTitle,
      slug,
      date: new Date().toISOString(),
      updatedAt: serverTimestamp()
    };

    const action = editingId 
      ? updateDoc(doc(firestore, 'contentItems', editingId), data)
      : addDoc(collection(firestore, 'contentItems'), { ...data, createdAt: serverTimestamp() });

    action.then(() => {
      toast({ 
        title: finalStatus === 'draft' ? "Borrador Guardado" : "Crónica Publicada", 
        description: finalStatus === 'draft' 
          ? "El artículo se guardó como borrador (no visible al público)." 
          : "La crónica ya es visible en la bitácora abierta." 
      });
      cancelEditing();
      setActiveTab('inventory');
    }).catch(err => {
      toast({ variant: "destructive", title: "Error", description: err?.message || "No se pudo guardar." });
    }).finally(() => setIsSaving(false));
  };

  const handleAiRefinement = async () => {
    if (!aiInput) {
      toast({ variant: "destructive", title: "Error", description: "Ingresa un borrador para refinar." });
      return;
    }
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/editorial-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiInput }),
      });
      if (!response.ok) {
        throw new Error('Error en el servicio de refinamiento editorial');
      }
      const res: EditorialOutput = await response.json();
      setAiResult(res);
      toast({ title: "Refinamiento Completado", description: "La IA ha procesado tu narrativa." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error IA", description: "No se pudo conectar con el Laboratorio Editorial IA." });
    } finally {
      setIsAiLoading(false);
    }
  };

  const transferAiToEditor = () => {
    if (!aiResult) return;
    const newBlocks: ContentBlock[] = [
      { id: 'ai-1', type: 'text', content: aiResult.refinedText, alignment: 'justify' },
      { id: 'ai-2', type: 'quote', content: aiResult.regenerativeInsight, alignment: 'left' }
    ];
    setBlocks(newBlocks);
    setShowAiAssistant(false);
    toast({ title: "Narrativa Transferida", description: "El texto refinado ahora está en el editor." });
  };

  // --- CRUD: PODCASTS ---
  const savePodcast = (targetStatus?: 'published' | 'draft') => {
    if (!podTitle.trim() || !podUrl.trim()) {
      toast({ variant: "destructive", title: "Campos requeridos", description: "Título y URL del podcast son obligatorios." });
      return;
    }
    const finalStatus = targetStatus || podStatus;
    setIsSaving(true);
    const data = {
      title: podTitle.trim(),
      description: podDescription.trim(),
      url: podUrl.trim(),
      guest: podGuest.trim(),
      image: podImage.trim(),
      status: finalStatus,
      updatedAt: serverTimestamp()
    };

    const action = editingId
      ? updateDoc(doc(firestore, 'podcasts', editingId), data)
      : addDoc(collection(firestore, 'podcasts'), { ...data, createdAt: serverTimestamp() });

    action.then(() => {
      toast({ 
        title: editingId ? "Podcast Actualizado" : "Podcast Publicado", 
        description: editingId ? "Los cambios se han guardado con éxito." : "El episodio está guardado en Firestore." 
      });
      cancelEditing();
      setActiveTab('inventory');
    }).catch((err: any) => {
      toast({ variant: "destructive", title: "Error al guardar", description: err?.message || "No se pudo guardar el podcast." });
    }).finally(() => setIsSaving(false));
  };

  const startEditPodcast = (item: any) => {
    setEditingId(item.id);
    setPodTitle(item.title || '');
    setPodDescription(item.description || '');
    setPodUrl(item.url || '');
    setPodGuest(item.guest || '');
    setPodImage(item.image || '');
    setPodStatus(item.status || 'published');
    setActiveForm('podcast');
    setActiveTab('content');
  };

  const togglePodcastStatus = async (id: string, currentStatus: string = 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      await updateDoc(doc(firestore, 'podcasts', id), { status: newStatus, updatedAt: serverTimestamp() });
      toast({ title: newStatus === 'published' ? "Podcast Publicado" : "Movido a Borrador" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al cambiar estado", description: err?.message });
    }
  };

  const deletePodcast = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este podcast de la plataforma?")) return;
    try {
      await deleteDoc(doc(firestore, 'podcasts', id));
      toast({ title: "Podcast Eliminado", description: "El episodio fue removido de Firestore." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al eliminar", description: err?.message });
    }
  };

  // --- CRUD: PROYECTOS ---
  const saveProject = (targetStatus?: 'published' | 'draft') => {
    if (!projTitle.trim()) {
      toast({ variant: "destructive", title: "Campo requerido", description: "El título del proyecto es obligatorio." });
      return;
    }
    const finalStatus = targetStatus || projStatus;
    setIsSaving(true);
    const data = {
      title: projTitle.trim(),
      description: projDesc.trim(),
      category: projCategory.trim() || 'Regeneración',
      image: projImage.trim() || 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/03.png',
      link: projLink.trim() || '/multimedia',
      status: finalStatus,
      updatedAt: serverTimestamp()
    };

    const action = editingId
      ? updateDoc(doc(firestore, 'projects', editingId), data)
      : addDoc(collection(firestore, 'projects'), { ...data, createdAt: serverTimestamp() });

    action.then(() => {
      toast({ 
        title: editingId ? "Proyecto Actualizado" : "Proyecto Guardado", 
        description: editingId ? "Los cambios se guardaron con éxito." : "El caso técnico se guardó en Firestore." 
      });
      cancelEditing();
      setActiveTab('inventory');
    }).catch((err: any) => {
      toast({ variant: "destructive", title: "Error al guardar", description: err?.message || "No se pudo guardar el proyecto." });
    }).finally(() => setIsSaving(false));
  };

  const startEditProject = (item: any) => {
    setEditingId(item.id);
    setProjTitle(item.title || '');
    setProjDesc(item.description || '');
    setProjCategory(item.category || '');
    setProjImage(item.image || '');
    setProjLink(item.link || '');
    setProjStatus(item.status || 'published');
    setActiveForm('project');
    setActiveTab('content');
  };

  const toggleProjectStatus = async (id: string, currentStatus: string = 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      await updateDoc(doc(firestore, 'projects', id), { status: newStatus, updatedAt: serverTimestamp() });
      toast({ title: newStatus === 'published' ? "Proyecto Publicado" : "Movido a Borrador" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al cambiar estado", description: err?.message });
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este proyecto del portafolio?")) return;
    try {
      await deleteDoc(doc(firestore, 'projects', id));
      toast({ title: "Proyecto Eliminado", description: "El proyecto fue retirado de Firestore." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al eliminar", description: err?.message });
    }
  };

  // --- CRUD: TESTIMONIOS ---
  const saveTestimonial = (targetStatus?: 'published' | 'draft') => {
    if (!testQuote.trim() || !testAuthorName.trim()) {
      toast({ variant: "destructive", title: "Campos requeridos", description: "La cita y el nombre del autor son obligatorios." });
      return;
    }
    const finalStatus = targetStatus || testStatus;
    setIsSaving(true);
    const data = {
      quote: testQuote.trim(),
      authorName: testAuthorName.trim(),
      authorTitle: testAuthorTitle.trim(),
      status: finalStatus,
      updatedAt: serverTimestamp()
    };

    const action = editingId
      ? updateDoc(doc(firestore, 'testimonials', editingId), data)
      : addDoc(collection(firestore, 'testimonials'), { ...data, createdAt: serverTimestamp() });

    action.then(() => {
      toast({ 
        title: editingId ? "Testimonio Actualizado" : "Testimonio Guardado", 
        description: editingId ? "Los cambios se guardaron con éxito." : "El testimonio se guardó en Firestore." 
      });
      cancelEditing();
      setActiveTab('inventory');
    }).catch((err: any) => {
      toast({ variant: "destructive", title: "Error al guardar", description: err?.message || "No se pudo guardar el testimonio." });
    }).finally(() => setIsSaving(false));
  };

  const startEditTestimonial = (item: any) => {
    setEditingId(item.id);
    setTestQuote(item.quote || '');
    setTestAuthorName(item.authorName || '');
    setTestAuthorTitle(item.authorTitle || '');
    setTestStatus(item.status || 'published');
    setActiveForm('testimonial');
    setActiveTab('content');
  };

  const toggleTestimonialStatus = async (id: string, currentStatus: string = 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      await updateDoc(doc(firestore, 'testimonials', id), { status: newStatus, updatedAt: serverTimestamp() });
      toast({ title: newStatus === 'published' ? "Testimonio Publicado" : "Movido a Borrador" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al cambiar estado", description: err?.message });
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este testimonio?")) return;
    try {
      await deleteDoc(doc(firestore, 'testimonials', id));
      toast({ title: "Testimonio Eliminado", description: "El testimonio fue retirado de Firestore." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al eliminar", description: err?.message });
    }
  };

  // --- CRUD: VIDEOS Y MULTIMEDIA ---
  const saveVideo = (targetStatus?: 'published' | 'draft') => {
    if (!vidTitle.trim() || !vidUrl.trim()) {
      toast({ variant: "destructive", title: "Campos requeridos", description: "Título y URL del video son obligatorios." });
      return;
    }
    const finalStatus = targetStatus || vidStatus;
    setIsSaving(true);
    const ytId = extractYouTubeId(vidUrl.trim());
    const data = {
      title: vidTitle.trim(),
      url: vidUrl.trim(),
      platform: vidPlatform || 'YouTube',
      description: vidDescription.trim(),
      image: vidImage.trim() || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ''),
      youtubeId: ytId,
      status: finalStatus,
      updatedAt: serverTimestamp()
    };

    const action = editingId
      ? updateDoc(doc(firestore, 'featuredVideos', editingId), data)
      : addDoc(collection(firestore, 'featuredVideos'), { ...data, createdAt: serverTimestamp() });

    action.then(() => {
      toast({ 
        title: editingId ? "Video Actualizado" : "Video Publicado", 
        description: editingId ? "Los cambios se guardaron con éxito." : "El video se guardó en Firestore." 
      });
      cancelEditing();
      setActiveTab('inventory');
    }).catch((err: any) => {
      toast({ variant: "destructive", title: "Error al guardar", description: err?.message || "No se pudo guardar el video." });
    }).finally(() => setIsSaving(false));
  };

  const startEditVideo = (item: any) => {
    setEditingId(item.id);
    setVidTitle(item.title || '');
    setVidUrl(item.url || '');
    setVidPlatform(item.platform || 'YouTube');
    setVidDescription(item.description || '');
    setVidImage(item.image || '');
    setVidStatus(item.status || 'published');
    setActiveForm('video');
    setActiveTab('content');
  };

  const toggleVideoStatus = async (id: string, currentStatus: string = 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      await updateDoc(doc(firestore, 'featuredVideos', id), { status: newStatus, updatedAt: serverTimestamp() });
      toast({ title: newStatus === 'published' ? "Video Publicado" : "Movido a Borrador" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al cambiar estado", description: err?.message });
    }
  };

  const deleteVideo = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este contenido audiovisual?")) return;
    try {
      await deleteDoc(doc(firestore, 'featuredVideos', id));
      toast({ title: "Video Eliminado", description: "El video fue retirado de Firestore." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al eliminar", description: err?.message });
    }
  };

  // --- CRUD: RECURSOS ---
  const saveResource = (targetStatus?: 'published' | 'draft') => {
    if (!resTitle || !resDownloadUrl) {
      toast({ variant: "destructive", title: "Campos requeridos", description: "El título y el enlace de descarga son obligatorios." });
      return;
    }
    const finalStatus = targetStatus || resStatus;
    setIsSaving(true);
    const data = {
      title: resTitle.trim(),
      description: resDescription.trim() || '',
      category: resCategory || 'Toolkit',
      format: resFormat || 'PDF Editorial',
      pages: resPages.trim() || '',
      downloadUrl: resDownloadUrl.trim(),
      coverImage: resCoverImage.trim() || '',
      status: finalStatus,
      updatedAt: serverTimestamp()
    };

    const action = editingId
      ? updateDoc(doc(firestore, 'resources', editingId), data)
      : addDoc(collection(firestore, 'resources'), { ...data, downloadsCount: 0, createdAt: serverTimestamp() });

    action.then(() => {
      toast({ 
        title: editingId ? "Recurso Actualizado" : "Recurso Publicado", 
        description: editingId ? "Los cambios se han guardado con éxito." : "El nuevo recurso ya está disponible en la Biblioteca." 
      });
      cancelEditing();
      setActiveTab('inventory');
    }).catch(err => {
      toast({ variant: "destructive", title: "Error al guardar", description: err?.message || "No se pudo guardar el recurso." });
    }).finally(() => setIsSaving(false));
  };

  const startEditResource = (item: any) => {
    setEditingId(item.id);
    setResTitle(item.title || '');
    setResDescription(item.description || '');
    setResCategory(item.category || 'Toolkit');
    setResFormat(item.format || 'PDF Editorial');
    setResPages(item.pages || '');
    setResDownloadUrl(item.downloadUrl || '');
    setResCoverImage(item.coverImage || '');
    setResStatus(item.status || 'published');
    setActiveForm('resource');
    setActiveTab('content');
  };

  const toggleResourceStatus = async (id: string, currentStatus: string = 'published') => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      await updateDoc(doc(firestore, 'resources', id), { status: newStatus, updatedAt: serverTimestamp() });
      toast({ title: newStatus === 'published' ? "Recurso Publicado" : "Movido a Borrador" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error al cambiar estado", description: err?.message });
    }
  };

  const deleteResource = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este recurso de la biblioteca pública?')) return;
    try {
      await deleteDoc(doc(firestore, 'resources', id));
      toast({ title: "Recurso Eliminado", description: "El material fue retirado de la biblioteca." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err?.message || "No se pudo eliminar el recurso." });
    }
  };

  const markAsRead = (id: string) => {
    updateDoc(doc(firestore, 'messages', id), { read: true });
  };

  if (isUserLoading && isSessionChecking) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  if (!isAuthorized) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-6 text-center">
      <ShieldAlert className="h-16 w-16 text-primary opacity-40 animate-pulse" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Acceso Restringido</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          La cuenta actual ({effectiveEmail || 'No autenticado'}) no tiene permisos asignados para el panel editorial.
        </p>
      </div>
      <Button onClick={handleLogout} className="rounded-lg text-xs uppercase tracking-wider font-bold">
        Cerrar sesión / Cambiar Cuenta
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-secondary text-white py-14 mb-12 border-b">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-headline tracking-tighter">Laboratorio de Gestión Editorial</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground/80 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>Admin activo: {effectiveEmail || 'Sesión Autorizada'}</span>
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-[9px] font-bold uppercase tracking-widest h-11 px-8 border-white/20 hover:bg-white/10"><LogOut className="mr-3 h-3.5" /> Salir</Button>
        </div>
      </div>

      <div className="section-container">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <TabsList className="bg-muted/30 p-1.5 rounded-sm border w-full md:w-auto flex flex-wrap">
            <TabsTrigger value="overview" className="text-[9px] font-bold uppercase tracking-widest px-6 md:px-8">Escritorio</TabsTrigger>
            <TabsTrigger value="ecosystem" className="text-[9px] font-bold uppercase tracking-widest px-6 md:px-8 flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-primary" /> Ecosistema Global
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-[9px] font-bold uppercase tracking-widest px-6 md:px-8 flex items-center gap-2">
              <FileDown className="h-3.5 w-3.5 text-primary" /> Recursos ({resourceItems?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="inventory" className="text-[9px] font-bold uppercase tracking-widest px-6 md:px-8">Gestión</TabsTrigger>
            <TabsTrigger value="messages" className="text-[9px] font-bold uppercase tracking-widest px-6 md:px-8">Mensajes {messageItems?.filter(m => !m.read).length ? <Badge className="ml-2 bg-primary h-4 px-1.5">{messageItems.filter(m => !m.read).length}</Badge> : null}</TabsTrigger>
            <TabsTrigger value="content" className="text-[9px] font-bold uppercase tracking-widest px-6 md:px-8">{editingId ? 'Editando' : 'Publicar'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
            {/* Banner de Acceso Rápido al Configurador */}
            <Card className="rounded-sm border-primary/30 bg-primary/[0.03] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <Sliders className="h-4 w-4" /> Configurador Global del Ecosistema
                </div>
                <p className="text-sm text-muted-foreground font-light max-w-2xl">
                  Modifica en tiempo real los textos del Hero, el video cinematográfico de fondo, el manifiesto editorial, los diálogos multimedia y los canales de contacto sin tocar código.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button 
                  onClick={() => setActiveTab('ecosystem')}
                  className="bg-primary text-white text-[9px] font-bold uppercase tracking-widest h-10 px-6 shadow-sm hover:opacity-90"
                >
                  <Sliders className="mr-2 h-3.5 w-3.5" /> Abrir Configurador
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="text-[9px] font-bold uppercase tracking-widest h-10 px-4"
                >
                  <Link href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3.5 w-3.5" /> Ver Web
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Módulo de Estadísticas de Lectura, Recursos y Engagement */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">MONITOREO EDITORIAL</span>
                  <h3 className="text-xl font-bold font-headline">Métricas de Contenido y Engagement</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span>Sincronización en tiempo real</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="rounded-sm border p-6 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Crónicas en Bitácora</span>
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-headline mt-3">{blogItems?.length || 0}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      {blogItems?.filter(b => b.status !== 'draft').length || 0} Públicas
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                      {blogItems?.filter(b => b.status === 'draft').length || 0} Borradores
                    </span>
                  </div>
                </Card>

                <Card className="rounded-sm border p-6 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Biblioteca de Recursos</span>
                    <FileDown className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-headline mt-3">{resourceItems?.length || 0}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {resourceItems?.reduce((acc, r) => acc + (r.downloadsCount || 0), 0) || 0} descargas totales
                    </span>
                  </div>
                </Card>

                <Card className="rounded-sm border p-6 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Casos de Impacto</span>
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-headline mt-3">{projectItems?.length || 0}</div>
                  <p className="text-[11px] text-muted-foreground mt-2">Proyectos documentados en portafolio</p>
                </Card>

                <Card className="rounded-sm border p-6 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mensajes de Contacto</span>
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-headline mt-3">{messageItems?.length || 0}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {messageItems?.filter(m => !m.read).length ? (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary text-white">
                        {messageItems.filter(m => !m.read).length} sin leer
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Al día
                      </span>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* Accesos Directos de Creación Rápida */}
            <div className="space-y-4 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">ACCIONES RÁPIDAS</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { title: 'Bitácora', icon: <BookOpen className="h-4 w-4" />, action: () => { cancelEditing(); setActiveForm('blog'); setActiveTab('content'); } },
                  { title: 'Recurso / Toolkit', icon: <FileDown className="h-4 w-4" />, action: () => { cancelEditing(); setActiveForm('resource'); setActiveTab('content'); } },
                  { title: 'Proyecto', icon: <Briefcase className="h-4 w-4" />, action: () => { cancelEditing(); setActiveForm('project'); setActiveTab('content'); } },
                  { title: 'Testimonio', icon: <QuoteIcon className="h-4 w-4" />, action: () => { cancelEditing(); setActiveForm('testimonial'); setActiveTab('content'); } },
                  { title: 'Podcast', icon: <Radio className="h-4 w-4" />, action: () => { cancelEditing(); setActiveForm('podcast'); setActiveTab('content'); } },
                ].map(item => (
                  <Card key={item.title} className="rounded-sm border-border/60 hover:shadow-xl transition-all group">
                    <CardHeader className="border-b bg-muted/10 p-6 group-hover:bg-primary/5 transition-colors">
                      <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                        {item.icon} {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Button variant="outline" className="w-full text-[9px] font-bold uppercase h-10 border-dashed hover:border-primary hover:text-primary" onClick={item.action}>
                        <Plus className="mr-2 h-3" /> Crear Nuevo
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ecosystem" className="space-y-10 animate-in fade-in duration-500">
            {/* Cabecera del Configurador */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block mb-1">GESTIÓN EDITORIAL CENTRAL</span>
                <h2 className="text-3xl font-bold font-headline tracking-tighter">Configurador Global del Ecosistema</h2>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  Personaliza los textos de impacto, el video cinematográfico del Hero, el manifiesto y los canales de contacto en tiempo real.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={resetEcosystemDefaults}
                  disabled={isSavingEcosystem}
                  className="text-[10px] font-bold uppercase tracking-widest h-11 px-5 border-dashed"
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" /> Restablecer Originales
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="text-[10px] font-bold uppercase tracking-widest h-11 px-5"
                >
                  <Link href="/" target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-3.5 w-3.5" /> Ver Portada
                  </Link>
                </Button>
                <Button 
                  onClick={saveEcosystemSettings}
                  disabled={isSavingEcosystem}
                  className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest h-11 px-8 shadow-md"
                >
                  {isSavingEcosystem ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                  ) : (
                    <><Check className="mr-2 h-4 w-4" /> Guardar Configuración</>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Columna Izquierda: Formulario Modular */}
              <div className="lg:col-span-8 space-y-10">

                {/* 1. HERO Y PORTADA */}
                <Card className="rounded-sm border shadow-sm">
                  <CardHeader className="border-b bg-muted/10 p-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                      <Video className="h-4 w-4 text-primary" /> Portada & Hero Audiovisual
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">Sección Superior</Badge>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {/* Video de Fondo Hero */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
                        <span>Video de Fondo de YouTube (URL o ID)</span>
                        <span className="text-[9px] text-muted-foreground font-mono font-normal">
                          ID Detectado: {extractYouTubeId(ecosystemSettings.heroVideoId) || 'Ninguno'}
                        </span>
                      </Label>
                      <Input
                        value={ecosystemSettings.heroVideoId}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, heroVideoId: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=0DmyalU2zL4 ó 0DmyalU2zL4"
                        className="font-mono text-xs"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Pega el enlace completo de YouTube o el ID del video. Se reproducirá en bucle con velo cinematográfico oscuro como fondo de la cabecera.
                      </p>
                    </div>

                    {/* Títulos Línea 1 y Línea 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Título Línea 1</Label>
                        <Input
                          value={ecosystemSettings.heroTitleLine1}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, heroTitleLine1: e.target.value }))}
                          placeholder="Narrativas que generan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Resaltado 1 (Cursiva / Acento)</Label>
                        <Input
                          value={ecosystemSettings.heroHighlight1}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, heroHighlight1: e.target.value }))}
                          placeholder="confianza."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Título Línea 2</Label>
                        <Input
                          value={ecosystemSettings.heroTitleLine2}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, heroTitleLine2: e.target.value }))}
                          placeholder="Estrategias que movilizan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Resaltado 2 (Cursiva / Acento)</Label>
                        <Input
                          value={ecosystemSettings.heroHighlight2}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, heroHighlight2: e.target.value }))}
                          placeholder="personas."
                        />
                      </div>
                    </div>

                    {/* Propósito Editorial */}
                    <div className="space-y-2 pt-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Propósito Editorial / Subtítulo</Label>
                      <Textarea
                        value={ecosystemSettings.heroPurpose}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, heroPurpose: e.target.value }))}
                        rows={3}
                        placeholder="El cambio cultural y la sostenibilidad no ocurren por decreto..."
                      />
                    </div>

                    {/* Botones de Acción (CTAs) */}
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 p-4 bg-muted/10 rounded-sm border">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary block">Botón Primario</span>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase">Texto del Botón</Label>
                          <Input
                            value={ecosystemSettings.heroPrimaryBtnText}
                            onChange={e => setEcosystemSettings(prev => ({ ...prev, heroPrimaryBtnText: e.target.value }))}
                            placeholder="INSIGHTS"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase">Enlace de Destino</Label>
                          <Input
                            value={ecosystemSettings.heroPrimaryBtnLink}
                            onChange={e => setEcosystemSettings(prev => ({ ...prev, heroPrimaryBtnLink: e.target.value }))}
                            placeholder="/blog"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 p-4 bg-muted/10 rounded-sm border">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">Botón Secundario</span>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase">Texto del Botón</Label>
                          <Input
                            value={ecosystemSettings.heroSecondaryBtnText}
                            onChange={e => setEcosystemSettings(prev => ({ ...prev, heroSecondaryBtnText: e.target.value }))}
                            placeholder="NUESTRA MIRADA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase">Enlace de Destino</Label>
                          <Input
                            value={ecosystemSettings.heroSecondaryBtnLink}
                            onChange={e => setEcosystemSettings(prev => ({ ...prev, heroSecondaryBtnLink: e.target.value }))}
                            placeholder="#mission"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. EL DESAFÍO Y MANIFIESTO */}
                <Card className="rounded-sm border shadow-sm">
                  <CardHeader className="border-b bg-muted/10 p-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                      <Compass className="h-4 w-4 text-primary" /> El Desafío & Manifiesto
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">Sección Central</Badge>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Etiqueta Superior</Label>
                        <Input
                          value={ecosystemSettings.missionEyebrow}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, missionEyebrow: e.target.value }))}
                          placeholder="EL DESAFÍO"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Título Principal</Label>
                        <Input
                          value={ecosystemSettings.missionTitle}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, missionTitle: e.target.value }))}
                          placeholder="Articular"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Resaltado (Cursiva)</Label>
                        <Input
                          value={ecosystemSettings.missionTitleHighlight}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, missionTitleHighlight: e.target.value }))}
                          placeholder="Realidades."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">URL Imagen Editorial</Label>
                      <Input
                        value={ecosystemSettings.missionImageUrl}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, missionImageUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Descripción del Desafío</Label>
                      <Textarea
                        value={ecosystemSettings.missionDescription}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, missionDescription: e.target.value }))}
                        rows={4}
                        placeholder="Vivimos en un ecosistema saturado de información..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Cita / Manifiesto de Compromiso</Label>
                      <Textarea
                        value={ecosystemSettings.missionQuote}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, missionQuote: e.target.value }))}
                        rows={3}
                        placeholder="No creemos en comunicar por comunicar..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 2.1 ÁREAS DE TRABAJO (IMPACTO ESTRATÉGICO) */}
                <Card className="rounded-sm border shadow-sm">
                  <CardHeader className="border-b bg-muted/10 p-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-primary" /> Áreas de Trabajo (Impacto Estratégico)
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">Fotografía & Textos</Badge>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <p className="text-xs text-muted-foreground">
                      Configura la imagen fotográfica editorial y los textos de la sección de Áreas de Trabajo en la página de inicio.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Etiqueta Superior</Label>
                        <Input
                          value={ecosystemSettings.areasEyebrow || ''}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, areasEyebrow: e.target.value }))}
                          placeholder="ÁREAS DE TRABAJO"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Título Principal</Label>
                        <Input
                          value={ecosystemSettings.areasTitle || ''}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, areasTitle: e.target.value }))}
                          placeholder="Impacto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">Resaltado (Cursiva)</Label>
                        <Input
                          value={ecosystemSettings.areasTitleHighlight || ''}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, areasTitleHighlight: e.target.value }))}
                          placeholder="Estratégico."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">URL Imagen / Fotografía</Label>
                      <Input
                        value={ecosystemSettings.areasImage || ''}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, areasImage: e.target.value }))}
                        placeholder="/images/impacto-estrategico.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Descripción</Label>
                      <Textarea
                        value={ecosystemSettings.areasDescription || ''}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, areasDescription: e.target.value }))}
                        rows={3}
                        placeholder="Nuestra visión integrada conecta la estrategia de impacto..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 3. DIÁLOGOS MULTIMEDIA DESTACADOS */}
                <Card className="rounded-sm border shadow-sm">
                  <CardHeader className="border-b bg-muted/10 p-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                      <Film className="h-4 w-4 text-primary" /> Diálogos Multimedia Destacados (Portada)
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">3 Videos Destacados</Badge>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <p className="text-xs text-muted-foreground">
                      Estos tres videos se presentan en la cuadrícula de Diálogos Multimedia de la página principal. Al hacer clic, se abrirán instantáneamente en el reproductor modal.
                    </p>

                    <div className="space-y-6">
                      {ecosystemSettings.featuredVideos.map((video, idx) => {
                        const vidId = extractYouTubeId(video.youtubeId);
                        const thumbUrl = `https://img.youtube.com/vi/${vidId}/mqdefault.jpg`;
                        return (
                          <div key={video.id || idx} className="p-6 bg-muted/10 border rounded-sm flex flex-col md:flex-row gap-6 items-start">
                            {/* Preview Thumbnail */}
                            <div className="w-full md:w-44 aspect-video relative bg-black rounded-sm overflow-hidden flex-shrink-0 border">
                              {vidId ? (
                                <Image
                                  src={thumbUrl}
                                  alt={video.title || `Video ${idx + 1}`}
                                  fill
                                  referrerPolicy="no-referrer"
                                  className="object-cover brightness-75"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                  Sin ID
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-8 w-8 rounded-full bg-black/70 flex items-center justify-center">
                                  <Play className="h-3.5 w-3.5 fill-white text-white ml-0.5" />
                                </div>
                              </div>
                            </div>

                            {/* Inputs */}
                            <div className="flex-1 space-y-4 w-full">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                                  Posición 0{idx + 1}
                                </span>
                                {vidId && (
                                  <a
                                    href={`https://www.youtube.com/watch?v=${vidId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3" /> Probar Video
                                  </a>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase">Título del Diálogo</Label>
                                <Input
                                  value={video.title}
                                  onChange={e => {
                                    const next = [...ecosystemSettings.featuredVideos];
                                    next[idx] = { ...next[idx], title: e.target.value };
                                    setEcosystemSettings(prev => ({ ...prev, featuredVideos: next }));
                                  }}
                                  placeholder="Título del Diálogo o Episodio"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase">Enlace o ID de YouTube</Label>
                                <Input
                                  value={video.youtubeId}
                                  onChange={e => {
                                    const next = [...ecosystemSettings.featuredVideos];
                                    next[idx] = { ...next[idx], youtubeId: e.target.value };
                                    setEcosystemSettings(prev => ({ ...prev, featuredVideos: next }));
                                  }}
                                  placeholder="https://www.youtube.com/watch?v=... ó ID"
                                  className="font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* 4. CANALES DE CONTACTO Y PIE DE PÁGINA */}
                <Card className="rounded-sm border shadow-sm">
                  <CardHeader className="border-b bg-muted/10 p-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                      <Share2 className="h-4 w-4 text-primary" /> Canales de Contacto, Redes & Pie de Página
                    </CardTitle>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">Global</Badge>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">WhatsApp: Número (con código país)</Label>
                        <Input
                          value={ecosystemSettings.whatsappNumber}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                          placeholder="573162809797"
                        />
                        <p className="text-[10px] text-muted-foreground">Sin signos +, guiones ni espacios.</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">WhatsApp: Mensaje Predeterminado</Label>
                        <Input
                          value={ecosystemSettings.whatsappMessage}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, whatsappMessage: e.target.value }))}
                          placeholder="Hola Ángela, vi tu bitácora..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">URL Perfil LinkedIn</Label>
                        <Input
                          value={ecosystemSettings.linkedinUrl}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                          placeholder="https://www.linkedin.com/in/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest">URL Spotify Podcast</Label>
                        <Input
                          value={ecosystemSettings.spotifyUrl}
                          onChange={e => setEcosystemSettings(prev => ({ ...prev, spotifyUrl: e.target.value }))}
                          placeholder="https://open.spotify.com/show/..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Correo Institucional de Contacto</Label>
                      <Input
                        value={ecosystemSettings.contactEmail}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="contacto@theothernarrative.com"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Lema del Pie de Página (Footer)</Label>
                      <Input
                        value={ecosystemSettings.footerMotto}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, footerMotto: e.target.value }))}
                        placeholder="Narrativas. Confianza. Participación. Impacto."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Descripción Institucional del Pie de Página</Label>
                      <Textarea
                        value={ecosystemSettings.footerDescription}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, footerDescription: e.target.value }))}
                        rows={3}
                        placeholder="Laboratorio estratégico y editorial que ayuda a transformar..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Texto de Derechos / Copyright</Label>
                      <Input
                        value={ecosystemSettings.footerCopyright}
                        onChange={e => setEcosystemSettings(prev => ({ ...prev, footerCopyright: e.target.value }))}
                        placeholder="THE OTHER NARRATIVE | NARRATIVAS QUE GENERAN CONFIANZA."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Columna Derecha: Vista Previa y Estado de Publicación */}
              <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-24 space-y-6">
                  {/* Tarjeta de Control Rápido */}
                  <Card className="rounded-sm border shadow-md bg-card">
                    <CardHeader className="border-b p-6 bg-muted/10">
                      <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" /> Sincronización en Vivo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <p className="text-xs text-muted-foreground font-light leading-relaxed">
                        Al guardar, los cambios se propagan de inmediato a la base de datos y se reflejan en la portada para todos los visitantes.
                      </p>

                      <div className="space-y-3">
                        <Button
                          onClick={saveEcosystemSettings}
                          disabled={isSavingEcosystem}
                          className="w-full bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest h-12 shadow-md"
                        >
                          {isSavingEcosystem ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                          ) : (
                            <><Check className="mr-2 h-4 w-4" /> Guardar Todo Ahora</>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          asChild
                          className="w-full text-[10px] font-bold uppercase tracking-widest h-11"
                        >
                          <Link href="/" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-3.5 w-3.5" /> Abrir Portada Pública
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Previsualización del Hero */}
                  <Card className="rounded-sm border overflow-hidden shadow-sm bg-black text-white">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>Simulación Hero</span>
                      <span className="text-primary">En Directo</span>
                    </div>
                    <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                      {extractYouTubeId(ecosystemSettings.heroVideoId) ? (
                        <Image
                          src={`https://img.youtube.com/vi/${extractYouTubeId(ecosystemSettings.heroVideoId)}/hqdefault.jpg`}
                          alt="Hero Video Preview"
                          fill
                          referrerPolicy="no-referrer"
                          className="object-cover opacity-40 brightness-75"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                          Sin video configurado
                        </div>
                      )}
                      <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
                        <p className="text-[9px] font-bold tracking-tight text-white/90 leading-tight line-clamp-2">
                          {ecosystemSettings.heroTitleLine1} <span className="text-primary italic">{ecosystemSettings.heroHighlight1}</span>
                        </p>
                        <p className="text-[8px] text-white/60 font-light mt-1 line-clamp-2">
                          {ecosystemSettings.heroPurpose}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[7px] font-bold uppercase px-2 py-0.5 bg-primary text-white rounded-[2px]">
                            {ecosystemSettings.heroPrimaryBtnText || 'CTA 1'}
                          </span>
                          <span className="text-[7px] font-bold uppercase px-2 py-0.5 border border-white/30 text-white rounded-[2px]">
                            {ecosystemSettings.heroSecondaryBtnText || 'CTA 2'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="animate-in fade-in duration-500">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-headline tracking-tighter">Bandeja de Entrada</h2>
              <div className="grid grid-cols-1 gap-6">
                {messageItems?.length === 0 ? (
                  <Card className="p-12 text-center text-muted-foreground font-light border-dashed">No hay mensajes aún.</Card>
                ) : (
                  messageItems?.map(msg => (
                    <Card key={msg.id} className={cn("rounded-sm border-l-4 transition-all", msg.read ? "border-l-border" : "border-l-primary shadow-md")}>
                      <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold">{msg.name}</span>
                            <span className="text-xs text-muted-foreground">&lt;{msg.email}&gt;</span>
                            {msg.createdAt && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {new Date(msg.createdAt.toDate()).toLocaleString('es-ES')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-light text-foreground/80 leading-relaxed italic">&ldquo;{msg.message}&rdquo;</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {!msg.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(msg.id)} className="text-[9px] font-bold uppercase tracking-widest text-primary">
                              <CheckCircle className="mr-2 h-3.5 w-3.5" /> Marcar leído
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(firestore, 'messages', msg.id))} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block mb-1">BIBLIOTECA & TOOLKITS</span>
                <h2 className="text-3xl font-bold font-headline tracking-tighter">Gestión de Recursos Descargables</h2>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  Administra los toolkits, guías metodológicas y manifiestos descargables de libre acceso publicados en /recursos.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  asChild
                  className="text-[10px] font-bold uppercase tracking-widest h-11 px-5"
                >
                  <Link href="/recursos" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3.5 w-3.5" /> Ver Biblioteca Pública
                  </Link>
                </Button>
                <Button 
                  onClick={() => {
                    cancelEditing();
                    setActiveForm('resource');
                    setActiveTab('content');
                  }}
                  className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest h-11 px-6 shadow-md"
                >
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Recurso
                </Button>
              </div>
            </div>

            {/* Tarjetas de métricas de la biblioteca */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="p-6 rounded-sm border bg-muted/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Materiales</span>
                <div className="text-3xl font-bold font-headline mt-2">{resourceItems?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">En el catálogo de recursos</p>
              </Card>
              <Card className="p-6 rounded-sm border bg-muted/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Descargas Totales</span>
                <div className="text-3xl font-bold font-headline mt-2 text-primary">
                  {resourceItems?.reduce((acc, r) => acc + (r.downloadsCount || 0), 0) || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Interacciones de descarga registradas</p>
              </Card>
              <Card className="p-6 rounded-sm border bg-muted/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Último Agregado</span>
                <div className="text-xl font-bold font-headline mt-2 truncate">
                  {resourceItems && resourceItems.length > 0 ? resourceItems[0].title : 'Ninguno aún'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {resourceItems && resourceItems.length > 0 ? (resourceItems[0].category || 'General') : 'Crea tu primer material'}
                </p>
              </Card>
            </div>

            {/* Tabla de Recursos */}
            <Card className="rounded-sm border overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-muted/20">
                    <TableHead className="pl-6 py-4 text-[10px] font-bold uppercase tracking-wider">Material / Documento</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Categoría</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Formato / Páginas</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center">Descargas</TableHead>
                    <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-wider">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!resourceItems || resourceItems.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-16 text-center text-muted-foreground text-sm">
                        No hay recursos registrados aún en Firestore. Haz clic en &ldquo;Nuevo Recurso&rdquo; para agregar el primer toolkit o guía metodológica.
                      </TableCell>
                    </TableRow>
                  ) : (
                    resourceItems.map(item => (
                      <TableRow key={item.id} className="border-b hover:bg-muted/10 transition-colors">
                        <TableCell className="pl-6 py-5">
                          <div className="font-headline font-bold text-base text-foreground">{item.title}</div>
                          <p className="text-xs text-muted-foreground font-light line-clamp-1 max-w-md mt-0.5">{item.description}</p>
                        </TableCell>
                        <TableCell>
                          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-primary/10 text-primary">
                            {item.category || 'General'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-foreground">{item.format || 'PDF Editorial'}</div>
                          {item.pages && <div className="text-[11px] text-muted-foreground">{item.pages}</div>}
                        </TableCell>
                        <TableCell className="text-center font-bold font-mono text-sm text-primary">
                          {item.downloadsCount || 0}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            {item.downloadUrl && (
                              <Button variant="ghost" size="icon" asChild title="Abrir Enlace">
                                <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </a>
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => startEditResource(item)} title="Editar Recurso">
                              <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteResource(item.id)} title="Eliminar Recurso">
                              <Trash2 className="h-4 w-4 text-destructive hover:bg-destructive/10" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="animate-in fade-in duration-500">
            <Card className="rounded-sm overflow-hidden border shadow-xl">
               <Tabs defaultValue="inv-blog">
                  <TabsList className="w-full justify-start border-b rounded-none h-16 bg-muted/5 p-0 overflow-x-auto">
                    <TabsTrigger value="inv-blog" className="h-full rounded-none px-6 text-[10px] font-bold uppercase tracking-widest">Bitácora ({blogItems?.length || 0})</TabsTrigger>
                    <TabsTrigger value="inv-proj" className="h-full rounded-none px-6 text-[10px] font-bold uppercase tracking-widest">Proyectos ({projectItems?.length || 0})</TabsTrigger>
                    <TabsTrigger value="inv-test" className="h-full rounded-none px-6 text-[10px] font-bold uppercase tracking-widest">Testimonios ({testimonialItems?.length || 0})</TabsTrigger>
                    <TabsTrigger value="inv-pod" className="h-full rounded-none px-6 text-[10px] font-bold uppercase tracking-widest">Podcast ({podItems?.length || 0})</TabsTrigger>
                    <TabsTrigger value="inv-vid" className="h-full rounded-none px-6 text-[10px] font-bold uppercase tracking-widest">Videos ({videoItems?.length || 0})</TabsTrigger>
                    <TabsTrigger value="inv-res" className="h-full rounded-none px-6 text-[10px] font-bold uppercase tracking-widest">Recursos ({resourceItems?.length || 0})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="inv-blog" className="p-0">
                    {/* Barra de filtros de estado editorial */}
                    <div className="p-6 bg-muted/10 border-b flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={blogFilterStatus === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setBlogFilterStatus('all')}
                          className="text-xs h-8"
                        >
                          Todos ({blogItems?.length || 0})
                        </Button>
                        <Button
                          variant={blogFilterStatus === 'published' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setBlogFilterStatus('published')}
                          className="text-xs h-8 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
                        >
                          Publicados ({(blogItems || []).filter(i => i.status !== 'draft').length})
                        </Button>
                        <Button
                          variant={blogFilterStatus === 'draft' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setBlogFilterStatus('draft')}
                          className="text-xs h-8 text-amber-800 dark:text-amber-300 border-amber-500/30"
                        >
                          Borradores ({(blogItems || []).filter(i => i.status === 'draft').length})
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          cancelEditing();
                          setBlogStatus('published');
                          setActiveForm('blog');
                          setActiveTab('content');
                        }}
                        className="text-xs h-8 gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Nueva Crónica
                      </Button>
                    </div>

                    <Table>
                      <TableBody>
                        {(!blogItems || blogItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay artículos en la bitácora.</TableCell></TableRow>
                        ) : (
                          (blogItems || [])
                            .filter(item => {
                              if (blogFilterStatus === 'published') return item.status !== 'draft';
                              if (blogFilterStatus === 'draft') return item.status === 'draft';
                              return true;
                            })
                            .map(item => {
                              const isDraft = item.status === 'draft';
                              return (
                                <TableRow key={item.id} className="border-b hover:bg-muted/5">
                                  <TableCell className="pl-8 py-5">
                                    <div className="flex items-center gap-5">
                                      {item.image && (
                                        <div className="relative w-16 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0 border">
                                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                      )}
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2.5">
                                          <h4 className="font-headline text-base font-bold">{item.title}</h4>
                                          {isDraft ? (
                                            <Badge variant="outline" className="border-amber-500/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                                              Borrador
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                                              Publicado
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{item.excerpt}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end gap-2">
                                      {/* Alternador rápido de estado */}
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => toggleArticleStatus(item.id, item.status)}
                                        className={cn(
                                          "h-8 text-xs font-semibold px-2.5",
                                          isDraft 
                                            ? "border-emerald-500/40 text-emerald-700 hover:bg-emerald-50" 
                                            : "border-amber-500/40 text-amber-700 hover:bg-amber-50"
                                        )}
                                        title={isDraft ? "Publicar en Bitácora" : "Cambiar a Borrador"}
                                      >
                                        {isDraft ? (
                                          <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Publicar</span>
                                        ) : (
                                          <span className="flex items-center gap-1 text-muted-foreground">Despublicar</span>
                                        )}
                                      </Button>

                                      {/* Vista previa / Link directo */}
                                      <Link href={`/blog/${item.slug}`} target="_blank">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Ver crónica">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </Link>

                                      {/* Editar en CMS */}
                                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar en CMS" onClick={() => {
                                        setEditingId(item.id);
                                        setBlogTitle(item.title);
                                        setBlogExcerpt(item.excerpt);
                                        setBlogType(item.type);
                                        setBlogImage(item.image);
                                        setBlogStatus(item.status === 'draft' ? 'draft' : 'published');
                                        setBlocks([{ id: 'edit-1', type: 'text', content: item.body, alignment: 'justify' }]);
                                        setActiveForm('blog');
                                        setActiveTab('content');
                                      }}>
                                        <Pencil className="h-4 w-4" />
                                      </Button>

                                      {/* Eliminar con confirmación */}
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Eliminar crónica" onClick={() => deleteBlogPost(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* PROYECTOS */}
                  <TabsContent value="inv-proj" className="p-0">
                    <div className="p-6 bg-muted/10 border-b flex justify-between items-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Proyectos registrados ({projectItems?.length || 0})</span>
                      <Button size="sm" className="text-xs h-8 gap-1.5" onClick={() => {
                        cancelEditing();
                        setActiveForm('project');
                        setActiveTab('content');
                      }}>
                        <Plus className="h-3.5 w-3.5" /> Nuevo Proyecto
                      </Button>
                    </div>
                    <Table>
                      <TableBody>
                        {(!projectItems || projectItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay proyectos registrados.</TableCell></TableRow>
                        ) : (
                          projectItems.map(item => {
                            const isDraft = item.status === 'draft';
                            return (
                              <TableRow key={item.id} className="border-b hover:bg-muted/5">
                                <TableCell className="pl-8 py-5">
                                  <div className="flex items-center gap-5">
                                    {item.image && (
                                      <div className="relative w-16 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0 border">
                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                      </div>
                                    )}
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2.5">
                                        <h4 className="font-headline text-base font-bold">{item.title}</h4>
                                        {isDraft ? (
                                          <Badge variant="outline" className="border-amber-500/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                                            Borrador
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                                            Publicado
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">{item.category} • {item.description}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => toggleProjectStatus(item.id, item.status)}
                                      className={cn("h-8 text-xs font-semibold px-2.5", isDraft ? "border-emerald-500/40 text-emerald-700" : "border-amber-500/40 text-amber-700")}
                                    >
                                      {isDraft ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Publicar</span> : <span>Despublicar</span>}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditProject(item)} title="Editar proyecto">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteProject(item.id)} title="Eliminar proyecto">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* TESTIMONIOS */}
                  <TabsContent value="inv-test" className="p-0">
                    <div className="p-6 bg-muted/10 border-b flex justify-between items-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Testimonios de confianza ({testimonialItems?.length || 0})</span>
                      <Button size="sm" className="text-xs h-8 gap-1.5" onClick={() => {
                        cancelEditing();
                        setActiveForm('testimonial');
                        setActiveTab('content');
                      }}>
                        <Plus className="h-3.5 w-3.5" /> Nuevo Testimonio
                      </Button>
                    </div>
                    <Table>
                      <TableBody>
                        {(!testimonialItems || testimonialItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay testimonios registrados.</TableCell></TableRow>
                        ) : (
                          testimonialItems.map(item => {
                            const isDraft = item.status === 'draft';
                            return (
                              <TableRow key={item.id} className="border-b hover:bg-muted/5">
                                <TableCell className="pl-8 py-5">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2.5">
                                      <h4 className="font-headline text-base font-bold italic">&ldquo;{item.quote}&rdquo;</h4>
                                      {isDraft ? (
                                        <Badge variant="outline" className="border-amber-500/60 bg-amber-50 text-amber-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Borrador</Badge>
                                      ) : (
                                        <Badge variant="outline" className="border-emerald-500/60 bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Publicado</Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.authorName} — {item.authorTitle}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => toggleTestimonialStatus(item.id, item.status)}
                                      className={cn("h-8 text-xs font-semibold px-2.5", isDraft ? "border-emerald-500/40 text-emerald-700" : "border-amber-500/40 text-amber-700")}
                                    >
                                      {isDraft ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Publicar</span> : <span>Despublicar</span>}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditTestimonial(item)} title="Editar testimonio">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteTestimonial(item.id)} title="Eliminar testimonio">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* PODCASTS */}
                  <TabsContent value="inv-pod" className="p-0">
                    <div className="p-6 bg-muted/10 border-b flex justify-between items-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Podcasts en Firestore ({podItems?.length || 0})</span>
                      <Button size="sm" className="text-xs h-8 gap-1.5" onClick={() => {
                        cancelEditing();
                        setActiveForm('podcast');
                        setActiveTab('content');
                      }}>
                        <Plus className="h-3.5 w-3.5" /> Nuevo Podcast
                      </Button>
                    </div>
                    <Table>
                      <TableBody>
                        {(!podItems || podItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay podcasts registrados en Firestore.</TableCell></TableRow>
                        ) : (
                          podItems.map(item => {
                            const isDraft = item.status === 'draft';
                            return (
                              <TableRow key={item.id} className="border-b hover:bg-muted/5">
                                <TableCell className="pl-8 py-5">
                                  <div className="flex items-center gap-5">
                                    {item.image && (
                                      <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0 border">
                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                      </div>
                                    )}
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2.5">
                                        <h4 className="font-headline text-base font-bold">{item.title}</h4>
                                        {isDraft ? (
                                          <Badge variant="outline" className="border-amber-500/60 bg-amber-50 text-amber-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Borrador</Badge>
                                        ) : (
                                          <Badge variant="outline" className="border-emerald-500/60 bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Publicado</Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">{item.guest ? `Con ${item.guest} • ` : ''}{item.description}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => togglePodcastStatus(item.id, item.status)}
                                      className={cn("h-8 text-xs font-semibold px-2.5", isDraft ? "border-emerald-500/40 text-emerald-700" : "border-amber-500/40 text-amber-700")}
                                    >
                                      {isDraft ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Publicar</span> : <span>Despublicar</span>}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditPodcast(item)} title="Editar podcast">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deletePodcast(item.id)} title="Eliminar podcast">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* VIDEOS Y MULTIMEDIA */}
                  <TabsContent value="inv-vid" className="p-0">
                    <div className="p-6 bg-muted/10 border-b flex justify-between items-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Videos y Contenidos Audiovisuales ({videoItems?.length || 0})</span>
                      <Button size="sm" className="text-xs h-8 gap-1.5" onClick={() => {
                        cancelEditing();
                        setActiveForm('video');
                        setActiveTab('content');
                      }}>
                        <Plus className="h-3.5 w-3.5" /> Nuevo Video
                      </Button>
                    </div>
                    <Table>
                      <TableBody>
                        {(!videoItems || videoItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay videos registrados en Firestore.</TableCell></TableRow>
                        ) : (
                          videoItems.map(item => {
                            const isDraft = item.status === 'draft';
                            return (
                              <TableRow key={item.id} className="border-b hover:bg-muted/5">
                                <TableCell className="pl-8 py-5">
                                  <div className="flex items-center gap-5">
                                    {(item.image || item.youtubeId) && (
                                      <div className="relative w-16 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0 border">
                                        <Image src={item.image || `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`} alt={item.title} fill className="object-cover" />
                                      </div>
                                    )}
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2.5">
                                        <h4 className="font-headline text-base font-bold">{item.title}</h4>
                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
                                          {item.platform || 'Video'}
                                        </Badge>
                                        {isDraft ? (
                                          <Badge variant="outline" className="border-amber-500/60 bg-amber-50 text-amber-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Borrador</Badge>
                                        ) : (
                                          <Badge variant="outline" className="border-emerald-500/60 bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Publicado</Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground line-clamp-1">{item.url}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => toggleVideoStatus(item.id, item.status)}
                                      className={cn("h-8 text-xs font-semibold px-2.5", isDraft ? "border-emerald-500/40 text-emerald-700" : "border-amber-500/40 text-amber-700")}
                                    >
                                      {isDraft ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Publicar</span> : <span>Despublicar</span>}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditVideo(item)} title="Editar video">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteVideo(item.id)} title="Eliminar video">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  {/* RECURSOS */}
                  <TabsContent value="inv-res" className="p-0">
                    <div className="p-6 bg-muted/10 border-b flex justify-between items-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Recursos y Toolkits Descargables ({resourceItems?.length || 0})</span>
                      <Button size="sm" className="text-xs h-8 gap-1.5" onClick={() => {
                        cancelEditing();
                        setActiveForm('resource');
                        setActiveTab('content');
                      }}>
                        <Plus className="h-3.5 w-3.5" /> Nuevo Recurso
                      </Button>
                    </div>
                    <Table>
                      <TableBody>
                        {(!resourceItems || resourceItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay recursos en la biblioteca.</TableCell></TableRow>
                        ) : (
                          resourceItems.map(item => {
                            const isDraft = item.status === 'draft';
                            return (
                              <TableRow key={item.id} className="border-b hover:bg-muted/5">
                                <TableCell className="pl-8 py-5">
                                  <div className="flex items-center gap-5">
                                    {item.coverImage && (
                                      <div className="relative w-12 h-16 rounded-sm overflow-hidden bg-muted flex-shrink-0 border shadow-sm">
                                        <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                                      </div>
                                    )}
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2.5">
                                        <h4 className="font-headline text-base font-bold">{item.title}</h4>
                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">{item.category}</Badge>
                                        {isDraft ? (
                                          <Badge variant="outline" className="border-amber-500/60 bg-amber-50 text-amber-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Borrador</Badge>
                                        ) : (
                                          <Badge variant="outline" className="border-emerald-500/60 bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">Publicado</Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">{item.format || 'PDF'} • {item.downloadsCount || 0} descargas</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => toggleResourceStatus(item.id, item.status)}
                                      className={cn("h-8 text-xs font-semibold px-2.5", isDraft ? "border-emerald-500/40 text-emerald-700" : "border-amber-500/40 text-amber-700")}
                                    >
                                      {isDraft ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Publicar</span> : <span>Despublicar</span>}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditResource(item)} title="Editar recurso">
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteResource(item.id)} title="Eliminar recurso">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
               </Tabs>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-3 space-y-4">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Contenedor Editorial</h3>
                 <div className="grid grid-cols-1 gap-3">
                    <Button variant={activeForm === 'blog' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('blog')}><BookOpen className="mr-4 h-4" /> Crónica</Button>
                    <Button variant={activeForm === 'resource' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('resource')}><FileDown className="mr-4 h-4" /> Recurso / Toolkit</Button>
                    <Button variant={activeForm === 'project' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('project')}><Briefcase className="mr-4 h-4" /> Proyecto</Button>
                    <Button variant={activeForm === 'testimonial' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('testimonial')}><QuoteIcon className="mr-4 h-4" /> Testimonio</Button>
                    <Button variant={activeForm === 'podcast' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('podcast')}><Radio className="mr-4 h-4" /> Podcast</Button>
                    <Button variant={activeForm === 'video' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('video')}><Video className="mr-4 h-4" /> Video / Multimedia</Button>
                 </div>
               </div>

               <div className="lg:col-span-9">
                 {activeForm === 'blog' && (
                   <div className="space-y-12 animate-in slide-in-from-right-8">
                     <div className="flex justify-between items-center bg-muted/20 p-6 rounded-sm border mb-8">
                       <div className="space-y-1">
                         <h3 className="text-xl font-bold font-headline tracking-tighter">Editor de Crónicas</h3>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Acompañamiento Narrativo Habilitado</p>
                       </div>
                       <Button 
                        variant="outline" 
                        onClick={() => setShowAiAssistant(!showAiAssistant)}
                        className={cn("text-[9px] font-bold uppercase tracking-widest h-11 px-8 gap-3 transition-all", showAiAssistant ? "bg-primary text-white border-primary" : "text-primary border-primary/20")}
                       >
                         <Wand2 className="h-3.5 w-3.5" /> {showAiAssistant ? 'Cerrar Asistente' : '✨ Laboratorio IA'}
                       </Button>
                     </div>

                     <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
                        <div className={cn("space-y-8 transition-all duration-500", showAiAssistant ? "xl:col-span-7" : "xl:col-span-12")}>
                           <Card className="rounded-sm border-border/60 shadow-xl overflow-hidden">
                              <CardHeader className="bg-muted/10 p-8 border-b flex flex-row items-center justify-between">
                                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em]">Metadatos de la Historia</CardTitle>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1",
                                    blogStatus === 'draft' 
                                      ? "border-amber-500/50 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" 
                                      : "border-emerald-500/50 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  )}
                                >
                                  {blogStatus === 'draft' ? 'Modo Borrador' : 'Modo Público'}
                                </Badge>
                              </CardHeader>
                              <CardContent className="p-10 space-y-10">
                                {/* Selector de Estado de Publicación */}
                                <div className="space-y-3">
                                  <Label className="text-[10px] font-bold uppercase opacity-60">Estado Editorial</Label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                      onClick={() => setBlogStatus('published')}
                                      className={cn(
                                        "cursor-pointer flex items-start gap-3.5 p-4 rounded-sm border transition-all select-none",
                                        blogStatus === 'published' 
                                          ? "border-emerald-600 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500 shadow-xs" 
                                          : "border-border/80 bg-background/50 text-muted-foreground hover:border-emerald-500/50"
                                      )}
                                    >
                                      <div className="mt-0.5">
                                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center transition-colors", blogStatus === 'published' ? "border-emerald-600 bg-emerald-600" : "border-muted-foreground")}>
                                          {blogStatus === 'published' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                        </div>
                                      </div>
                                      <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Publicado</span>
                                        <span className="text-[10px] text-muted-foreground leading-tight block">Visible para todos en la Bitácora abierta</span>
                                      </div>
                                    </div>

                                    <div
                                      onClick={() => setBlogStatus('draft')}
                                      className={cn(
                                        "cursor-pointer flex items-start gap-3.5 p-4 rounded-sm border transition-all select-none",
                                        blogStatus === 'draft' 
                                          ? "border-amber-600 bg-amber-500/10 text-amber-950 dark:text-amber-200 ring-1 ring-amber-500 shadow-xs" 
                                          : "border-border/80 bg-background/50 text-muted-foreground hover:border-amber-500/50"
                                      )}
                                    >
                                      <div className="mt-0.5">
                                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center transition-colors", blogStatus === 'draft' ? "border-amber-600 bg-amber-600" : "border-muted-foreground")}>
                                          {blogStatus === 'draft' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                        </div>
                                      </div>
                                      <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Borrador</span>
                                        <span className="text-[10px] text-muted-foreground leading-tight block">Privado en CMS y vista previa interna</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                  <div className="space-y-3"><Label className="text-[10px] font-bold uppercase opacity-60">Título Principal</Label><Input value={blogTitle} onChange={e => setBlogTitle(e.target.value)} className="h-14 font-bold text-lg" placeholder="La verdad en el territorio..." /></div>
                                  <div className="space-y-3"><Label className="text-[10px] font-bold uppercase opacity-60">Tipo de Contenido</Label><Input value={blogType} onChange={e => setBlogType(e.target.value)} className="h-14" /></div>
                                </div>
                                <div className="space-y-3"><Label className="text-[10px] font-bold uppercase opacity-60">Bajada o Resumen</Label><Textarea value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} rows={3} placeholder="Un breve adelanto de lo que el lector habitará..." /></div>
                                <div className="space-y-3"><Label className="text-[10px] font-bold uppercase opacity-60">URL Imagen de Portada</Label><Input value={blogImage} onChange={e => setBlogImage(e.target.value)} className="h-14" placeholder="https://images.unsplash.com/..." /></div>
                              </CardContent>
                           </Card>

                           <div className="space-y-8">
                              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                                <Layout className="h-4 w-4" /> Cuerpo de la Narrativa
                              </h4>
                              
                              <div className="space-y-4">
                                {blocks.map((block, idx) => (
                                  <EditableBlock 
                                    key={block.id} 
                                    block={block} 
                                    onChange={(c, a) => updateBlock(block.id, c, a)} 
                                    onRemove={() => removeBlock(block.id)}
                                    onMove={(dir) => moveBlock(idx, dir)}
                                  />
                                ))}
                              </div>

                              <div className="flex flex-wrap gap-4 pt-4 border-t border-dashed">
                                <Button variant="outline" size="sm" onClick={() => addBlock('title')} className="text-[9px] font-bold uppercase gap-2"><Heading3 className="h-3.5" /> Subtítulo</Button>
                                <Button variant="outline" size="sm" onClick={() => addBlock('text')} className="text-[9px] font-bold uppercase gap-2"><AlignLeft className="h-3.5" /> Párrafo</Button>
                                <Button variant="outline" size="sm" onClick={() => addBlock('quote')} className="text-[9px] font-bold uppercase gap-2"><QuoteIcon className="h-3.5" /> Cita</Button>
                              </div>

                              <Separator className="my-12" />

                              <div className="flex flex-wrap gap-4 pt-2">
                                <Button 
                                  className={cn(
                                    "flex-1 h-18 text-[11px] font-bold uppercase tracking-widest shadow-xl transition-all",
                                    blogStatus === 'draft' 
                                      ? "bg-amber-600 hover:bg-amber-700 text-white" 
                                      : "bg-secondary hover:bg-secondary/90 text-white"
                                  )} 
                                  onClick={() => saveBlogPost(blogStatus)} 
                                  disabled={isSaving}
                                >
                                  {isSaving ? (
                                    <Loader2 className="animate-spin mr-3" />
                                  ) : (
                                    editingId 
                                      ? (blogStatus === 'draft' ? 'Guardar Cambios (Borrador)' : 'Actualizar Crónica Publicada') 
                                      : (blogStatus === 'draft' ? 'Guardar como Borrador' : 'Publicar en Bitácora')
                                  )}
                                </Button>

                                {/* Opción rápida para publicar directamente si está en borrador */}
                                {blogStatus === 'draft' && (
                                  <Button 
                                    variant="outline"
                                    className="h-18 px-8 border-emerald-600/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-[10px] font-bold uppercase tracking-widest"
                                    onClick={() => saveBlogPost('published')}
                                    disabled={isSaving}
                                  >
                                    <Check className="h-4 w-4 mr-2" /> Publicar Directamente
                                  </Button>
                                )}

                                <Button variant="ghost" onClick={cancelEditing} className="h-18 px-8 text-muted-foreground uppercase text-[9px] font-bold tracking-widest">
                                  Cancelar
                                </Button>
                              </div>
                           </div>
                        </div>

                        {showAiAssistant && (
                          <div className="xl:col-span-5 animate-in slide-in-from-right-12 sticky top-32">
                             <Card className="rounded-sm border-primary/20 shadow-2xl overflow-hidden bg-muted/5">
                                <CardHeader className="bg-primary text-white p-6">
                                   <div className="flex items-center gap-3">
                                      <Sparkles className="h-5 w-5" />
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Laboratorio Editorial IA</span>
                                        <span className="text-[8px] opacity-70 tracking-widest uppercase">Asistente de Refinamiento Narrativo</span>
                                      </div>
                                   </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                   <div className="space-y-4">
                                      <Label className="text-[10px] font-bold uppercase opacity-60">Borrador o Ideas Técnicas</Label>
                                      <Textarea 
                                        value={aiInput} 
                                        onChange={e => setAiInput(e.target.value)} 
                                        className="min-h-[250px] bg-white text-sm leading-relaxed" 
                                        placeholder="Pega aquí tus ideas sueltas, notas de campo o borradores técnicos para que la IA los transforme en crónica..."
                                      />
                                   </div>
                                   
                                   <Button 
                                    className="w-full h-14 bg-primary text-white text-[10px] font-bold uppercase tracking-widest" 
                                    onClick={handleAiRefinement} 
                                    disabled={isAiLoading}
                                   >
                                      {isAiLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Refinar Narrativa Editorial'}
                                   </Button>

                                   {aiResult && (
                                     <div className="space-y-6 animate-in fade-in duration-700 pt-6 border-t border-primary/10">
                                        <div className="space-y-3">
                                          <span className="text-[9px] font-bold text-primary uppercase tracking-[0.3em]">Resultado Sugerido:</span>
                                          <ScrollArea className="h-[300px] w-full p-6 bg-white border border-primary/10 rounded-sm">
                                             <div className="prose prose-sm font-light text-foreground/80 leading-relaxed italic">
                                               &ldquo;{aiResult.refinedText}&rdquo;
                                             </div>
                                             <div className="mt-8 pt-6 border-t border-dashed">
                                                <span className="text-[9px] font-bold uppercase tracking-widest block mb-4">Insight Regenerativo:</span>
                                                <p className="text-sm font-headline italic text-primary">&ldquo;{aiResult.regenerativeInsight}&rdquo;</p>
                                             </div>
                                          </ScrollArea>
                                        </div>
                                        <Button 
                                          variant="secondary" 
                                          className="w-full h-12 gap-3 text-[9px] font-bold uppercase"
                                          onClick={transferAiToEditor}
                                        >
                                          <Copy className="h-3.5 w-3.5" /> Transferir al Editor Principal
                                        </Button>
                                     </div>
                                   )}
                                </CardContent>
                             </Card>
                          </div>
                        )}
                     </div>
                   </div>
                 )}

                 {/* Banner de Edición Activa */}
                 {editingId && (
                   <div className="bg-primary/10 border border-primary/30 p-4 rounded-sm flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                       <Pencil className="h-4 w-4 text-primary animate-pulse" />
                       <span className="text-xs font-bold text-foreground">
                         Modo Edición Activo (ID: {editingId})
                       </span>
                     </div>
                     <Button variant="outline" size="sm" onClick={cancelEditing} className="h-8 text-[10px] uppercase font-bold tracking-wider">
                       Cancelar edición / Crear nuevo
                     </Button>
                   </div>
                 )}

                 {activeForm === 'project' && (
                   <Card className="p-10 space-y-8 shadow-xl animate-in slide-in-from-right-8">
                      <div className="flex items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-4">
                          <Briefcase className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-bold font-headline">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", projStatus === 'draft' ? "border-amber-500 text-amber-700 bg-amber-50" : "border-emerald-500 text-emerald-700 bg-emerald-50")}>
                          {projStatus === 'draft' ? 'Borrador' : 'Publicado'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Estado de Publicación</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button type="button" variant={projStatus === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setProjStatus('published')} className="text-xs">
                            <Check className="h-3.5 w-3.5 mr-2" /> Público en Portafolio
                          </Button>
                          <Button type="button" variant={projStatus === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setProjStatus('draft')} className="text-xs">
                            Borrador Interno
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Título del Proyecto</Label><Input value={projTitle} onChange={e => setProjTitle(e.target.value)} /></div>
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Categoría</Label><Input value={projCategory} onChange={e => setProjCategory(e.target.value)} /></div>
                      </div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">URL Imagen (1200x800)</Label><Input value={projImage} onChange={e => setProjImage(e.target.value)} placeholder="https://..." /></div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Enlace Externo</Label><Input value={projLink} onChange={e => setProjLink(e.target.value)} placeholder="https://..." /></div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Descripción Técnica</Label><Textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} rows={4} /></div>
                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-16 bg-secondary text-white text-[10px] font-bold uppercase" onClick={() => saveProject()} disabled={isSaving}>
                          {isSaving ? 'Guardando...' : (editingId ? 'Actualizar Proyecto' : 'Guardar y Publicar Proyecto')}
                        </Button>
                        <Button variant="ghost" onClick={cancelEditing}>Cancelar</Button>
                      </div>
                   </Card>
                 )}

                 {activeForm === 'testimonial' && (
                   <Card className="p-10 space-y-8 shadow-xl animate-in slide-in-from-right-8">
                      <div className="flex items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-4">
                          <QuoteIcon className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-bold font-headline">{editingId ? 'Editar Testimonio' : 'Nuevo Testimonio de Confianza'}</h3>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", testStatus === 'draft' ? "border-amber-500 text-amber-700 bg-amber-50" : "border-emerald-500 text-emerald-700 bg-emerald-50")}>
                          {testStatus === 'draft' ? 'Borrador' : 'Publicado'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Estado de Publicación</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button type="button" variant={testStatus === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setTestStatus('published')} className="text-xs">
                            <Check className="h-3.5 w-3.5 mr-2" /> Visible en Mirada
                          </Button>
                          <Button type="button" variant={testStatus === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setTestStatus('draft')} className="text-xs">
                            Borrador Interno
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Cita / Palabra de Cliente *</Label><Textarea value={testQuote} onChange={e => setTestQuote(e.target.value)} rows={5} placeholder="Lo que dicen de nosotros..." /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Autor (Nombre) *</Label><Input value={testAuthorName} onChange={e => setTestAuthorName(e.target.value)} /></div>
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Cargo / Organización</Label><Input value={testAuthorTitle} onChange={e => setTestAuthorTitle(e.target.value)} /></div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-16 bg-secondary text-white text-[10px] font-bold uppercase" onClick={() => saveTestimonial()} disabled={isSaving}>
                          {isSaving ? 'Guardando...' : (editingId ? 'Actualizar Testimonio' : 'Guardar Testimonio')}
                        </Button>
                        <Button variant="ghost" onClick={cancelEditing}>Cancelar</Button>
                      </div>
                   </Card>
                 )}

                 {activeForm === 'podcast' && (
                   <Card className="p-10 space-y-8 shadow-xl animate-in slide-in-from-right-8">
                      <div className="flex items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-4">
                          <Radio className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-bold font-headline">{editingId ? 'Editar Episodio de Podcast' : 'Publicar Nuevo Episodio de Podcast'}</h3>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", podStatus === 'draft' ? "border-amber-500 text-amber-700 bg-amber-50" : "border-emerald-500 text-emerald-700 bg-emerald-50")}>
                          {podStatus === 'draft' ? 'Borrador' : 'Publicado'}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Estado de Publicación</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button type="button" variant={podStatus === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setPodStatus('published')} className="text-xs">
                            <Check className="h-3.5 w-3.5 mr-2" /> Visible en Multimedia
                          </Button>
                          <Button type="button" variant={podStatus === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setPodStatus('draft')} className="text-xs">
                            Borrador Interno
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Título del Episodio</Label><Input value={podTitle} onChange={e => setPodTitle(e.target.value)} /></div>
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Invitado (Opcional)</Label><Input value={podGuest} onChange={e => setPodGuest(e.target.value)} /></div>
                      </div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">URL del Reproductor (Spotify Embed)</Label><Input value={podUrl} onChange={e => setPodUrl(e.target.value)} placeholder="https://open.spotify.com/embed/..." /></div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">URL Imagen Cuadrada</Label><Input value={podImage} onChange={e => setPodImage(e.target.value)} /></div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Descripción Corta</Label><Textarea value={podDescription} onChange={e => setPodDescription(e.target.value)} /></div>
                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-16 bg-secondary text-white text-[10px] font-bold uppercase" onClick={() => savePodcast()} disabled={isSaving}>
                          {isSaving ? 'Guardando...' : (editingId ? 'Actualizar Podcast' : 'Guardar y Publicar Podcast')}
                        </Button>
                        <Button variant="ghost" onClick={cancelEditing}>Cancelar</Button>
                      </div>
                   </Card>
                 )}

                 {/* FORMULARIO DE VIDEO Y MULTIMEDIA */}
                 {activeForm === 'video' && (
                   <Card className="p-10 space-y-8 shadow-xl animate-in slide-in-from-right-8">
                      <div className="flex items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-4">
                          <Video className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-bold font-headline">
                            {editingId ? 'Editar Contenido Audiovisual' : 'Publicar Nuevo Video / Contenido Audiovisual'}
                          </h3>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", vidStatus === 'draft' ? "border-amber-500 text-amber-700 bg-amber-50" : "border-emerald-500 text-emerald-700 bg-emerald-50")}>
                          {vidStatus === 'draft' ? 'Borrador' : 'Publicado'}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Estado de Publicación</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button type="button" variant={vidStatus === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setVidStatus('published')} className="text-xs">
                            <Check className="h-3.5 w-3.5 mr-2" /> Visible en Multimedia
                          </Button>
                          <Button type="button" variant={vidStatus === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setVidStatus('draft')} className="text-xs">
                            Borrador Interno
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-bold uppercase">Título del Video *</Label>
                          <Input value={vidTitle} onChange={e => setVidTitle(e.target.value)} placeholder="Ej: COP 16 - Diálogos de Cambio" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-bold uppercase">Plataforma</Label>
                          <Input value={vidPlatform} onChange={e => setVidPlatform(e.target.value)} placeholder="YouTube, Vimeo, etc." />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase">URL del Video (YouTube o Vimeo) *</Label>
                        <Input value={vidUrl} onChange={e => setVidUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=0DmyalU2zL4" />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase">URL Miniatura Personalizada (Opcional)</Label>
                        <Input value={vidImage} onChange={e => setVidImage(e.target.value)} placeholder="Si se deja vacío, se extraerá de YouTube automáticamente" />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase">Descripción / Sinopsis</Label>
                        <Textarea value={vidDescription} onChange={e => setVidDescription(e.target.value)} rows={3} placeholder="Breve reseña del contenido o participantes..." />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-16 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90" onClick={() => saveVideo()} disabled={isSaving}>
                          {isSaving ? 'Guardando...' : (editingId ? 'Actualizar Video' : 'Guardar y Publicar Video')}
                        </Button>
                        <Button variant="ghost" onClick={cancelEditing}>Cancelar</Button>
                      </div>
                   </Card>
                 )}

                 {activeForm === 'resource' && (
                   <Card className="p-10 space-y-8 shadow-xl animate-in slide-in-from-right-8">
                      <div className="flex items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-4">
                          <FileDown className="h-6 w-6 text-primary" />
                          <div>
                            <h3 className="text-xl font-bold font-headline">
                              {editingId ? 'Editar Recurso Descargable' : 'Publicar Nuevo Recurso / Toolkit'}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Publica toolkits, guías metodológicas o manifiestos en la biblioteca pública.
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", resStatus === 'draft' ? "border-amber-500 text-amber-700 bg-amber-50" : "border-emerald-500 text-emerald-700 bg-emerald-50")}>
                          {resStatus === 'draft' ? 'Borrador' : 'Publicado'}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase opacity-60">Estado de Publicación</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button type="button" variant={resStatus === 'published' ? 'default' : 'outline'} size="sm" onClick={() => setResStatus('published')} className="text-xs">
                            <Check className="h-3.5 w-3.5 mr-2" /> Visible en Biblioteca
                          </Button>
                          <Button type="button" variant={resStatus === 'draft' ? 'default' : 'outline'} size="sm" onClick={() => setResStatus('draft')} className="text-xs">
                            Borrador Interno
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-bold uppercase">Título del Material *</Label>
                          <Input 
                            value={resTitle} 
                            onChange={e => setResTitle(e.target.value)} 
                            placeholder="Ej: Toolkit de Cartografía Territorial" 
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-bold uppercase">Categoría</Label>
                          <Input 
                            value={resCategory} 
                            onChange={e => setResCategory(e.target.value)} 
                            placeholder="Toolkit, Guía Metodológica, Manifiesto, etc." 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-bold uppercase">Formato</Label>
                          <Input 
                            value={resFormat} 
                            onChange={e => setResFormat(e.target.value)} 
                            placeholder="PDF Editorial, Guía Práctica, etc." 
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-bold uppercase">Extensión / Páginas</Label>
                          <Input 
                            value={resPages} 
                            onChange={e => setResPages(e.target.value)} 
                            placeholder="Ej: 24 páginas • Metodología" 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase">Enlace de Descarga Directa (URL / PDF / Drive) *</Label>
                        <Input 
                          value={resDownloadUrl} 
                          onChange={e => setResDownloadUrl(e.target.value)} 
                          placeholder="https://ejemplo.org/archivos/toolkit.pdf" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase">URL Imagen de Portada (Opcional)</Label>
                        <Input 
                          value={resCoverImage} 
                          onChange={e => setResCoverImage(e.target.value)} 
                          placeholder="https://picsum.photos/seed/recurso/800/600" 
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase">Descripción / Resumen de Valor</Label>
                        <Textarea 
                          value={resDescription} 
                          onChange={e => setResDescription(e.target.value)} 
                          rows={4} 
                          placeholder="Describe el propósito del recurso, para quién está diseñado y cómo aplicarlo..." 
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button 
                          className="flex-1 h-16 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 shadow-md" 
                          onClick={saveResource} 
                          disabled={isSaving}
                        >
                          {isSaving ? 'Guardando...' : (editingId ? 'Actualizar Recurso' : 'Guardar y Publicar Recurso')}
                        </Button>
                        <Button variant="ghost" onClick={cancelEditing}>Cancelar</Button>
                      </div>
                   </Card>
                 )}
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

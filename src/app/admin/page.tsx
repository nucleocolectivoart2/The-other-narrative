
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
  Layout
} from 'lucide-react';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { editorialAssistant, type EditorialOutput } from '@/ai/flows/editorial-assistant-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const AUTHORIZED_EMAILS = ['angelamgomez@gmail.com', 'nucleo.colectivo.art@gmail.com'];

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

  const isAuthorized = adminData?.isAdmin || (user?.email && AUTHORIZED_EMAILS.includes(user.email));

  const [activeTab, setActiveTab] = useState('overview');
  const [activeForm, setActiveForm] = useState<'none' | 'podcast' | 'project' | 'blog' | 'video' | 'testimonial'>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState<EditorialOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogType, setBlogType] = useState('Reflexión');
  const [blogImage, setBlogImage] = useState('');
  const [blogAuthorName, setBlogAuthorName] = useState('Ángela María Gómez Duque');
  const [blogAuthorTitle, setBlogAuthorTitle] = useState('Periodista experta en sostenibilidad');
  const [blocks, setBlocks] = useState<ContentBlock[]>([{ id: 'init-1', type: 'text', content: '', alignment: 'justify' }]);

  const [podTitle, setPodTitle] = useState('');
  const [podDescription, setPodDescription] = useState('');
  const [podUrl, setPodUrl] = useState('');
  const [podGuest, setPodGuest] = useState('');
  const [podImage, setPodImage] = useState('');

  const [vidTitle, setVidTitle] = useState('');
  const [vidUrl, setVidUrl] = useState('');
  const [vidPlatform, setVidPlatform] = useState('YouTube');

  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState('');
  const [projImage, setProjImage] = useState('');
  const [projLink, setProjLink] = useState('');

  const [testQuote, setTestQuote] = useState('');
  const [testAuthorName, setTestAuthorName] = useState('');
  const [testAuthorTitle, setTestAuthorTitle] = useState('');

  const blogQuery = useMemoFirebase(() => query(collection(firestore, 'contentItems'), orderBy('date', 'desc')), [firestore]);
  const { data: blogItems } = useCollection(blogQuery);
  const podcastQuery = useMemoFirebase(() => query(collection(firestore, 'podcasts'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: podItems } = useCollection(podcastQuery);
  const videoQuery = useMemoFirebase(() => query(collection(firestore, 'featuredVideos'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: videoItems } = useCollection(videoQuery);
  const projectsQuery = useMemoFirebase(() => query(collection(firestore, 'projects')), [firestore]);
  const { data: projectItems } = useCollection(projectsQuery);
  const testimonialsQuery = useMemoFirebase(() => query(collection(firestore, 'testimonials')), [firestore]);
  const { data: testimonialItems } = useCollection(testimonialsQuery);
  const messagesQuery = useMemoFirebase(() => query(collection(firestore, 'messages'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: messageItems } = useCollection(messagesQuery);

  useEffect(() => {
    if (!isUserLoading && !user) router.push('/login');
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
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
    setBlocks([{ id: 'reset', type: 'text', content: '', alignment: 'justify' }]);
    setPodTitle(''); setPodDescription(''); setPodUrl(''); setPodGuest(''); setPodImage('');
    setVidTitle(''); setVidUrl(''); setVidPlatform('YouTube');
    setProjTitle(''); setProjDesc(''); setProjCategory(''); setProjImage(''); setProjLink('');
    setTestQuote(''); setTestAuthorName(''); setTestAuthorTitle('');
    setActiveForm('none');
  };

  const saveBlogPost = () => {
    if (!blogTitle) {
      toast({ variant: "destructive", title: "Error", description: "El título es obligatorio." });
      return;
    }
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
      toast({ title: "Éxito", description: "Contenido guardado." });
      cancelEditing();
      setActiveTab('inventory');
    }).finally(() => setIsSaving(false));
  };

  const handleAiRefinement = async () => {
    if (!aiInput) {
      toast({ variant: "destructive", title: "Error", description: "Ingresa un borrador para refinar." });
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await editorialAssistant({ text: aiInput });
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

  const savePodcast = () => {
    if (!podTitle || !podUrl) {
      toast({ variant: "destructive", title: "Error", description: "Título y URL son obligatorios." });
      return;
    }
    setIsSaving(true);
    addDoc(collection(firestore, 'podcasts'), {
      title: podTitle,
      description: podDescription,
      url: podUrl,
      guest: podGuest,
      image: podImage,
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Éxito", description: "Podcast publicado." });
      cancelEditing();
      setActiveTab('inventory');
    }).finally(() => setIsSaving(false));
  };

  const saveProject = () => {
    if (!projTitle) return;
    setIsSaving(true);
    addDoc(collection(firestore, 'projects'), {
      title: projTitle,
      description: projDesc,
      category: projCategory,
      image: projImage,
      link: projLink,
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Éxito", description: "Proyecto guardado." });
      cancelEditing();
      setActiveTab('inventory');
    }).finally(() => setIsSaving(false));
  };

  const saveTestimonial = () => {
    if (!testQuote || !testAuthorName) return;
    setIsSaving(true);
    addDoc(collection(firestore, 'testimonials'), {
      quote: testQuote,
      authorName: testAuthorName,
      authorTitle: testAuthorTitle,
      createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Éxito", description: "Testimonio guardado." });
      cancelEditing();
      setActiveTab('inventory');
    }).finally(() => setIsSaving(false));
  };

  const markAsRead = (id: string) => {
    updateDoc(doc(firestore, 'messages', id), { read: true });
  };

  if (isUserLoading || isAdminLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  if (!user || !isAuthorized) return <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-8"><ShieldAlert className="h-16 w-16 opacity-20" /><h1 className="text-3xl font-bold font-headline">Acceso Restringido</h1><Button onClick={handleLogout}>Cerrar sesión</Button></div>;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-secondary text-white py-14 mb-12 border-b">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-headline tracking-tighter">Laboratorio de Gestión Editorial</h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">Admin: {user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-[9px] font-bold uppercase tracking-widest h-11 px-8 border-white/20 hover:bg-white/10"><LogOut className="mr-3 h-3.5" /> Salir</Button>
        </div>
      </div>

      <div className="section-container">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <TabsList className="bg-muted/30 p-1.5 rounded-sm border w-full md:w-auto">
            <TabsTrigger value="overview" className="text-[9px] font-bold uppercase tracking-widest px-8">Escritorio</TabsTrigger>
            <TabsTrigger value="inventory" className="text-[9px] font-bold uppercase tracking-widest px-8">Gestión</TabsTrigger>
            <TabsTrigger value="messages" className="text-[9px] font-bold uppercase tracking-widest px-8">Mensajes {messageItems?.filter(m => !m.read).length ? <Badge className="ml-2 bg-primary h-4 px-1.5">{messageItems.filter(m => !m.read).length}</Badge> : null}</TabsTrigger>
            <TabsTrigger value="content" className="text-[9px] font-bold uppercase tracking-widest px-8">{editingId ? 'Editando' : 'Publicar'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
            {[
              { title: 'Bitácora', icon: <BookOpen className="h-4 w-4" />, action: () => { setActiveForm('blog'); setActiveTab('content'); } },
              { title: 'Proyecto', icon: <Briefcase className="h-4 w-4" />, action: () => { setActiveForm('project'); setActiveTab('content'); } },
              { title: 'Testimonio', icon: <QuoteIcon className="h-4 w-4" />, action: () => { setActiveForm('testimonial'); setActiveTab('content'); } },
              { title: 'Podcast', icon: <Radio className="h-4 w-4" />, action: () => { setActiveForm('podcast'); setActiveTab('content'); } },
            ].map(item => (
              <Card key={item.title} className="rounded-sm border-border/60 hover:shadow-xl transition-all group">
                <CardHeader className="border-b bg-muted/10 p-8 group-hover:bg-primary/5 transition-colors">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-4">
                    {item.icon} {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <Button variant="outline" className="w-full text-[9px] font-bold uppercase h-11 border-dashed hover:border-primary hover:text-primary" onClick={item.action}>
                    <Plus className="mr-2 h-3" /> Crear Nueva
                  </Button>
                </CardContent>
              </Card>
            ))}
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
                          <p className="text-sm font-light text-foreground/80 leading-relaxed italic">"{msg.message}"</p>
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

          <TabsContent value="inventory" className="animate-in fade-in duration-500">
            <Card className="rounded-sm overflow-hidden border shadow-xl">
               <Tabs defaultValue="inv-blog">
                  <TabsList className="w-full justify-start border-b rounded-none h-16 bg-muted/5 p-0">
                    <TabsTrigger value="inv-blog" className="h-full rounded-none px-12 text-[10px] font-bold uppercase tracking-widest">Bitácora</TabsTrigger>
                    <TabsTrigger value="inv-proj" className="h-full rounded-none px-12 text-[10px] font-bold uppercase tracking-widest">Proyectos</TabsTrigger>
                    <TabsTrigger value="inv-test" className="h-full rounded-none px-12 text-[10px] font-bold uppercase tracking-widest">Testimonios</TabsTrigger>
                    <TabsTrigger value="inv-pod" className="h-full rounded-none px-12 text-[10px] font-bold uppercase tracking-widest">Podcast</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="inv-blog" className="p-0">
                    <Table>
                      <TableBody>
                        {(!blogItems || blogItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay artículos en la bitácora.</TableCell></TableRow>
                        ) : (
                          blogItems.map(item => (
                            <TableRow key={item.id} className="border-b">
                              <TableCell className="pl-12 py-6">
                                <div className="flex items-center gap-6">
                                  {item.image && (
                                    <div className="relative w-16 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0 border">
                                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-headline text-lg font-bold">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{item.excerpt}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-12">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => {
                                    setEditingId(item.id);
                                    setBlogTitle(item.title);
                                    setBlogExcerpt(item.excerpt);
                                    setBlogType(item.type);
                                    setBlogImage(item.image);
                                    // Simplified block reconstruction from HTML
                                    setBlocks([{ id: 'edit-1', type: 'text', content: item.body, alignment: 'justify' }]);
                                    setActiveForm('blog');
                                    setActiveTab('content');
                                  }}><Pencil className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(firestore, 'contentItems', item.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="inv-proj" className="p-0">
                    <Table>
                      <TableBody>
                        {(!projectItems || projectItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay proyectos registrados.</TableCell></TableRow>
                        ) : (
                          projectItems.map(item => (
                            <TableRow key={item.id} className="border-b">
                              <TableCell className="pl-12 py-6">
                                <div className="flex items-center gap-6">
                                  {item.image && (
                                    <div className="relative w-16 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0 border">
                                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-headline text-lg font-bold">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground">{item.category}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-12">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(firestore, 'projects', item.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="inv-test" className="p-0">
                    <Table>
                      <TableBody>
                        {(!testimonialItems || testimonialItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay testimonios registrados.</TableCell></TableRow>
                        ) : (
                          testimonialItems.map(item => (
                            <TableRow key={item.id} className="border-b">
                              <TableCell className="pl-12 py-6">
                                <div>
                                  <h4 className="font-headline text-base font-bold italic">"{item.quote}"</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{item.authorName} — {item.authorTitle}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-12">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(firestore, 'testimonials', item.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="inv-pod" className="p-0">
                    <Table>
                      <TableBody>
                        {(!podItems || podItems.length === 0) ? (
                          <TableRow><TableCell colSpan={2} className="py-12 text-center text-muted-foreground text-sm">No hay podcasts registrados en Firestore.</TableCell></TableRow>
                        ) : (
                          podItems.map(item => (
                            <TableRow key={item.id} className="border-b">
                              <TableCell className="pl-12 py-6">
                                <div className="flex items-center gap-6">
                                  {item.image && (
                                    <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-muted flex-shrink-0 border">
                                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-headline text-base font-bold">{item.title}</h4>
                                    {item.guest && <p className="text-xs text-muted-foreground">Con {item.guest}</p>}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-12">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc(firestore, 'podcasts', item.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
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
                    <Button variant={activeForm === 'project' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('project')}><Briefcase className="mr-4 h-4" /> Proyecto</Button>
                    <Button variant={activeForm === 'testimonial' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('testimonial')}><QuoteIcon className="mr-4 h-4" /> Testimonio</Button>
                    <Button variant={activeForm === 'podcast' ? 'default' : 'outline'} className="justify-start h-16 px-8 text-[10px] font-bold uppercase tracking-widest rounded-sm" onClick={() => setActiveForm('podcast')}><Radio className="mr-4 h-4" /> Podcast</Button>
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
                              <CardHeader className="bg-muted/10 p-8 border-b"><CardTitle className="text-xs font-bold uppercase tracking-[0.2em]">Metadatos de la Historia</CardTitle></CardHeader>
                              <CardContent className="p-10 space-y-10">
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

                              <div className="flex gap-4">
                                <Button className="flex-1 h-18 bg-secondary text-white text-[11px] font-bold uppercase tracking-widest shadow-xl" onClick={saveBlogPost} disabled={isSaving}>
                                  {isSaving ? <Loader2 className="animate-spin mr-3" /> : (editingId ? 'Actualizar Crónica' : 'Publicar en Bitácora')}
                                </Button>
                                <Button variant="ghost" onClick={cancelEditing} className="h-18 px-8 text-muted-foreground uppercase text-[9px] font-bold tracking-widest">Cancelar</Button>
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
                                               "{aiResult.refinedText}"
                                             </div>
                                             <div className="mt-8 pt-6 border-t border-dashed">
                                                <span className="text-[9px] font-bold uppercase tracking-widest block mb-4">Insight Regenerativo:</span>
                                                <p className="text-sm font-headline italic text-primary">"{aiResult.regenerativeInsight}"</p>
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

                 {activeForm === 'project' && (
                   <Card className="p-10 space-y-8 shadow-xl animate-in slide-in-from-right-8">
                      <div className="flex items-center gap-4 border-b pb-6">
                        <Briefcase className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-bold font-headline">Nuevo Proyecto</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Título del Proyecto</Label><Input value={projTitle} onChange={e => setProjTitle(e.target.value)} /></div>
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Categoría</Label><Input value={projCategory} onChange={e => setProjCategory(e.target.value)} /></div>
                      </div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">URL Imagen (1200x800)</Label><Input value={projImage} onChange={e => setProjImage(e.target.value)} placeholder="https://..." /></div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Enlace Externo</Label><Input value={projLink} onChange={e => setProjLink(e.target.value)} placeholder="https://..." /></div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Descripción Técnica</Label><Textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} rows={4} /></div>
                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-16 bg-secondary text-white text-[10px] font-bold uppercase" onClick={saveProject} disabled={isSaving}>Guardar Proyecto</Button>
                        <Button variant="ghost" onClick={cancelEditing}>Cancelar</Button>
                      </div>
                   </Card>
                 )}

                 {activeForm === 'testimonial' && (
                   <Card className="p-10 space-y-8 shadow-xl animate-in slide-in-from-right-8">
                      <div className="flex items-center gap-4 border-b pb-6">
                        <QuoteIcon className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-bold font-headline">Testimonio de Confianza</h3>
                      </div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Cita / Palabra de Cliente</Label><Textarea value={testQuote} onChange={e => setTestQuote(e.target.value)} rows={5} placeholder="Lo que dicen de nosotros..." /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Autor (Nombre)</Label><Input value={testAuthorName} onChange={e => setTestAuthorName(e.target.value)} /></div>
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Cargo / Organización</Label><Input value={testAuthorTitle} onChange={e => setTestAuthorTitle(e.target.value)} /></div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-16 bg-secondary text-white text-[10px] font-bold uppercase" onClick={saveTestimonial} disabled={isSaving}>Guardar Testimonio</Button>
                        <Button variant="ghost" onClick={cancelEditing}>Cancelar</Button>
                      </div>
                   </Card>
                 )}

                 {activeForm === 'podcast' && (
                   <Card className="p-10 space-y-8 shadow-xl animate-in slide-in-from-right-8">
                      <div className="flex items-center gap-4 border-b pb-6">
                        <Radio className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-bold font-headline">Publicar Episodio</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Título del Episodio</Label><Input value={podTitle} onChange={e => setPodTitle(e.target.value)} /></div>
                        <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Invitado (Opcional)</Label><Input value={podGuest} onChange={e => setPodGuest(e.target.value)} /></div>
                      </div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">URL del Reproductor (Spotify Embed)</Label><Input value={podUrl} onChange={e => setPodUrl(e.target.value)} placeholder="https://open.spotify.com/embed/..." /></div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">URL Imagen Cuadrada</Label><Input value={podImage} onChange={e => setPodImage(e.target.value)} /></div>
                      <div className="space-y-3"><Label className="text-[10px] font-bold uppercase">Descripción Corta</Label><Textarea value={podDescription} onChange={e => setPodDescription(e.target.value)} /></div>
                      <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-16 bg-secondary text-white text-[10px] font-bold uppercase" onClick={savePodcast} disabled={isSaving}>Publicar Podcast</Button>
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

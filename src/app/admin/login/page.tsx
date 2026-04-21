
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Para o protótipo, realizamos um login anônimo para satisfazer as regras do Firestore
      await signInAnonymously(auth);
      router.push('/admin');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: 'Não foi possível acessar o ambiente administrativo.'
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-6">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs uppercase tracking-widest hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Site
      </Link>
      
      <Card className="w-full max-w-md shadow-2xl border-none rounded-none overflow-hidden">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="text-center py-10">
          <div className="mx-auto w-12 h-12 bg-primary flex items-center justify-center rounded-sm mb-4">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-headline tracking-widest uppercase">Lumina Admin</CardTitle>
          <CardDescription className="uppercase text-[10px] tracking-[0.2em] font-bold text-muted-foreground mt-2">Acesso Restrito Concierge</CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-12">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="user" className="text-[10px] uppercase tracking-widest">Identificação</Label>
              <Input id="user" required className="rounded-none bg-secondary/10" placeholder="E-mail profissional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass" className="text-[10px] uppercase tracking-widest">Senha de Acesso</Label>
              <Input id="pass" required type="password" placeholder="••••••••" className="rounded-none bg-secondary/10" />
            </div>
            <div className="p-4 bg-primary/5 border border-primary/10 mb-2">
              <p className="text-[10px] text-center text-primary uppercase tracking-widest leading-relaxed">
                Ambiente de Demonstração:<br />Use qualquer e-mail e senha para entrar.
              </p>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 rounded-none uppercase tracking-widest text-sm">
              {loading ? "Verificando..." : "Entrar no Painel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

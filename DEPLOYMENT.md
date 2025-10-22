# Deployment Guide - AnimeViewer

## Vercel Deployment

Este projeto está configurado para fazer deploy automático no Vercel.

### Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)

### Passos para Deploy

1. **Fazer push do código para o repositório Git**
   ```bash
   git add .
   git commit -m "Initial commit: AnimeViewer"
   git push origin main
   ```

2. **Conectar ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Selecione seu repositório
   - Vercel detectará automaticamente a configuração

3. **Configuração Automática**
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

4. **Deploy**
   - Clique em "Deploy"
   - Vercel fará o build e deploy automaticamente

### Variáveis de Ambiente

Este projeto não requer variáveis de ambiente para funcionamento básico, pois usa a API pública do Jikan.

### Características

✅ **100 Animes Populares** - Carregados da API Jikan  
✅ **Interface Responsiva** - Funciona em todos os dispositivos  
✅ **Busca em Tempo Real** - Filtra animes enquanto digita  
✅ **Detalhes Completos** - Informações detalhadas de cada anime  
✅ **Tema Escuro** - Design moderno com gradiente roxo/rosa  

### Estrutura do Projeto

```
anime-viewer/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas (Home, AnimeDetail)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── App.tsx        # Roteamento principal
│   │   └── main.tsx       # Entrada da aplicação
│   └── public/            # Arquivos estáticos
├── server/                # Backend (placeholder)
├── package.json           # Dependências
├── vercel.json           # Configuração Vercel
└── README.md             # Documentação
```

### Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Componentes UI
- **Wouter** - Roteamento
- **Jikan API** - Dados de animes

### Performance

- Build otimizado com Vite
- Lazy loading de imagens
- Rate limiting respeitado na API Jikan (60 requests/min)
- Cache de dados no cliente

### Suporte

Para mais informações sobre o Vercel, visite: https://vercel.com/docs


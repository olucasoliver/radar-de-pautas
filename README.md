# Radar MS - Rede Colaborativa de Jornalistas

Rede social profissional para jornalistas de Mato Grosso do Sul compartilharem factuais, pistas e pautas em tempo real.

## 🚀 Melhorias Implementadas (v2.0)

### UX/UI
- ✅ **Sistema de Notificações Toast** - Feedback visual para todas as ações
- ✅ **Loading Overlay** - Indicador de processamento durante operações
- ✅ **Dark Mode** - Tema escuro com persistência no localStorage
- ✅ **Validação de Formulários** - Validação em tempo real com mensagens de erro
- ✅ **Contador de Caracteres** - Limite visual para descrições
- ✅ **Paginação** - Carregamento progressivo do feed ("Carregar mais")
- ✅ **Exportação de Dados** - Backup completo em JSON

### Acessibilidade
- ✅ Labels ARIA em todos os elementos interativos
- ✅ Foco visível melhorado
- ✅ Suporte a navegação por teclado
- ✅ Leitores de tela compatíveis

### Segurança
- ✅ Sanitização extra contra XSS
- ✅ Validação de inputs do lado do cliente
- ✅ Escape HTML em toda exibição de dados

### Performance
- ✅ Renderização paginada do feed
- ✅ Loading states para melhor percepção de performance
- ✅ Código modularizado por funcionalidade

## 📁 Estrutura

```
/workspace
├── index.html      # Estrutura da aplicação
├── styles.css      # Estilos + Dark Mode + Componentes
├── app.js          # Lógica + Novas funcionalidades
└── README.md       # Esta documentação
```

## 🎯 Funcionalidades

### Principais
- Feed de factuais com filtros múltiplos
- Publicação de novas pautas
- Perfis profissionais de jornalistas
- Sistema de colaboração (acompanhar, apurar)
- Busca full-text
- Filtros por cidade, categoria, urgência e status

### Novas (v2.0)
- **Toast Notifications**: `Toast.success()`, `Toast.error()`, `Toast.warning()`, `Toast.info()`
- **Dark Mode**: Toggle persistente no sidebar
- **Validação**: Campos obrigatórios, minlength, maxlength
- **Paginação**: 10 itens por página com "Carregar mais"
- **Exportação**: Download de backup JSON
- **Loading**: Overlay durante operações

## 🔧 Uso

### Abrir a aplicação
Basta abrir o arquivo `index.html` em qualquer navegador moderno.

### Ativar Dark Mode
Clique no botão "Dark Mode" no sidebar esquerdo.

### Exportar dados
Clique no botão "Exportar" na topbar para baixar um backup.

### Publicar factual
1. Complete seu perfil primeiro
2. Clique em "Publicar" ou "Novo factual"
3. Preencha os campos obrigatórios (mínimo 20 caracteres na descrição)
4. Clique em "Publicar no radar"

## 📊 Estatísticas

| Arquivo | Linhas |
|---------|--------|
| index.html | 365 |
| styles.css | 1074 |
| app.js | 1063 |
| **Total** | **2502** |

## 🛠️ Próximos Passos Sugeridos

1. **Backend Real**: Implementar API REST com Node.js/Express ou Python/FastAPI
2. **Autenticação**: Login seguro com JWT ou OAuth
3. **Upload de Mídia**: Integração com cloud storage (AWS S3, Cloudinary)
4. **Tempo Real**: WebSockets para atualizações instantâneas
5. **Geolocalização**: Mapa interativo de ocorrências
6. **Moderação**: Sistema de report e aprovação de conteúdo
7. **Analytics**: Dashboard de métricas e engajamento

## 📝 Licença

Projeto educacional/demonstrativo. Use como base para seus próprios projetos.

---

**Desenvolvido para jornalistas de Mato Grosso do Sul** 🇧🇷

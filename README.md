# Radar MS

Protótipo de uma rede social profissional para jornalistas de Mato Grosso do Sul compartilharem factuais, pistas de apuração e sugestões de pauta.

Esta versão é estática: não precisa instalar nada e pode ser publicada no GitHub Pages.

## Como usar

1. Abra `index.html` no navegador.
2. Cadastre um perfil profissional.
3. Publique factuais no feed.
4. Abra uma pauta para acompanhar detalhes, atualizações e colaboração.
5. Use filtros por cidade, editoria, urgência e status.

## O que já tem

- Interface com cara de aplicativo
- Recorte apenas para Mato Grosso do Sul
- Cadastro e perfil profissional local
- Feed de factuais e sugestões de pauta
- Tela de detalhe da pauta
- Publicação rápida de factual
- Atualizações dentro de cada pauta
- Botões de colaboração
- Status jornalísticos: pista, em checagem, confirmado, em cobertura, publicado e descartado
- Filtros por cidade, editoria, urgência e status
- Busca por texto
- Dados salvos no navegador com localStorage
- Layout responsivo para celular e computador

## Como publicar no GitHub Pages

1. Envie estes arquivos para a raiz do repositório:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
2. No GitHub, entre em `Settings`.
3. Clique em `Pages`.
4. Em `Build and deployment`, escolha:
   - `Source`: Deploy from a branch
   - `Branch`: main
   - Pasta: `/root`
5. Clique em `Save`.

## Limitações desta versão

Os dados ficam salvos apenas no navegador de quem está usando. Para virar uma plataforma real, será necessário adicionar:

- Login real
- Banco de dados
- Perfis públicos
- Moderação
- Histórico de edições
- Publicação em tempo real
- Regras de checagem e segurança

## Próximo passo sugerido

A próxima versão pode usar Supabase para login, banco de dados e feed compartilhado entre jornalistas.

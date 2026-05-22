# Radar MS

Prototipo de uma rede social profissional para jornalistas de Mato Grosso do Sul compartilharem factuais, pistas de apuracao e sugestoes de pauta.

Esta versao e estatica: nao precisa instalar nada e pode ser publicada no GitHub Pages.

## Como usar

1. Abra `index.html` no navegador.
2. Cadastre um perfil profissional.
3. Publique factuais no feed.
4. Use filtros por cidade, editoria, urgencia e status.

## Como publicar no GitHub Pages

1. Envie estes arquivos para a raiz do repositorio:
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

Depois de alguns minutos, o GitHub vai mostrar o link publico.

## O que ja tem

- Interface com cara de aplicativo
- Recorte apenas para Mato Grosso do Sul
- Cadastro e perfil profissional local
- Feed de factuais e sugestoes de pauta
- Publicacao assinada pelo perfil cadastrado
- Filtros por cidade, editoria, urgencia e status
- Busca por texto
- Botoes de colaboracao
- Dados salvos no navegador com localStorage
- Layout responsivo para celular e computador

## Limitacoes desta versao

Os dados ficam salvos apenas no navegador de quem esta usando. Para virar uma plataforma real, sera necessario adicionar:

- Login real
- Banco de dados
- Perfis publicos
- Moderacao
- Historico de edicoes
- Publicacao em tempo real
- Regras de checagem e seguranca

## Proximo passo sugerido

A proxima versao pode usar Supabase para login, banco de dados e feed compartilhado entre jornalistas.

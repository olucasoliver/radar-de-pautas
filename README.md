# Radar de Pautas

Protótipo de uma plataforma colaborativa para jornalistas compartilharem factuais, sugestões de pauta e alertas de apuração entre redações.

Esta primeira versão é estática: não precisa instalar nada, não precisa programar e pode ser publicada no GitHub Pages.

## Como usar

1. Baixe ou copie todos os arquivos deste projeto.
2. Envie para um repositório no GitHub.
3. Abra o arquivo `index.html` no navegador para testar localmente.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie estes arquivos para a raiz do repositório.
3. No GitHub, vá em `Settings`.
4. Clique em `Pages`.
5. Em `Build and deployment`, escolha:
   - `Source`: Deploy from a branch
   - `Branch`: main
   - Pasta: `/root`
6. Salve.

Depois de alguns minutos, o GitHub vai mostrar um link público do site.

## O que já tem

- Feed de pautas e factuais
- Formulário para publicar nova pauta
- Filtros por categoria, urgência, status e estado
- Busca por texto
- Botões de colaboração
- Dados salvos no navegador com localStorage
- Layout responsivo para celular e computador

## Limitações desta versão

Como esta é uma versão estática, os dados ficam salvos apenas no navegador de quem está usando. Para virar uma plataforma real com vários jornalistas usando ao mesmo tempo, será necessário adicionar:

- Login
- Banco de dados
- Moderação
- Perfis profissionais
- Controle de fontes e verificação
- Publicação em tempo real

## Próximos passos sugeridos

Uma boa segunda versão seria usar Supabase para login, banco de dados e posts em tempo real sem deixar o projeto complexo demais.


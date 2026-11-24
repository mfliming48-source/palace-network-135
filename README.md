# Palace Network 135

Sistema web de gestão, documentação e consulta dos endereços IPv4 da rede Palace `192.168.135.0/24`.

## Funcionalidades incluídas
- Login por Firebase Authentication (Email/Password).
- Dashboard com indicadores do inventário.
- Inventário dos IPs `.1` a `.254`, pesquisa e filtros.
- Cadastro/edição de equipamento, categoria, localização, MAC, fabricante, modelo, atribuição e estados.
- Estados de utilização separados dos estados de conectividade.
- Categorias e intervalos iniciais editáveis por administrador.
- Histórico de alterações (registos criados pela aplicação).
- Exportação CSV do inventário.
- Tema claro/escuro.
- Preparação para Firebase Hosting.
- Regras Firestore por perfil.

## Requisitos
Node.js 22 LTS recomendado (Vite 7 requer Node 20.19+ ou 22.12+), npm e Git.

## 1. Instalar localmente
```bash
npm install
cp .env.example .env
npm run dev
```
No Windows PowerShell, copie o ficheiro de ambiente assim:
```powershell
Copy-Item .env.example .env
```

## 2. Criar e configurar Firebase
1. Aceda a https://console.firebase.google.com/ e crie o projecto.
2. Adicione uma aplicação Web e copie os seis valores de configuração para `.env`.
3. Em Authentication > Sign-in method, active Email/Password.
4. Em Firestore Database, crie a base de dados em modo de produção.
5. Publique as regras:
```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules
```
6. Em Authentication > Users, crie o primeiro utilizador administrador (email e palavra-passe).
7. Em Firestore, crie manualmente a colecção `users` e um documento cujo ID seja exactamente o UID desse utilizador. Campos:
```json
{
  "displayName": "Administrador Palace",
  "email": "admin@palace.local",
  "role": "admin",
  "active": true
}
```
Use o email real do administrador. Não crie `admin@palace.local` se não for esse o email utilizado. O primeiro perfil tem de ser criado pelo Console para evitar que alguém se atribua permissões administrativas.
8. Depois de entrar na aplicação como administrador, use o botão **Inicializar 254 IPs** no módulo Gestão de IPs. É uma operação segura para documentos ainda inexistentes e não apaga os que já existem.

## 3. Variáveis de ambiente
Preencha `.env` com os valores da aplicação Web Firebase:
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=seu-projecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
Não envie `.env` para GitHub. O `.gitignore` já o exclui. A configuração web do Firebase não é uma chave de conta de serviço; nunca coloque service account JSON ou credenciais privadas no frontend.

## 4. Executar e compilar
```bash
npm run dev
npm run build
```

## 5. Publicar no GitHub
Crie um repositório vazio e privado com o nome `palace-network-135`. Na pasta do projecto:
```bash
git init
git add .
git commit -m "Initial Palace Network 135 application"
git branch -M main
git remote add origin https://github.com/SEU_UTILIZADOR/palace-network-135.git
git push -u origin main
```
Substitua `SEU_UTILIZADOR` pelo seu utilizador GitHub.

## 6. Publicar no Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase use --add
npm run build
firebase deploy --only hosting
```
Escolha o mesmo projecto Firebase usado na aplicação.

## Perfis
- `admin`: acesso total, gestão de utilizadores/categorias/ranges e eliminação.
- `technician`: consulta, criação e edição de IPs.
- `viewer`: apenas consulta.

Para criar outros utilizadores: crie a conta em Firebase Authentication e depois crie o documento `users/{UID}` no Firestore com `displayName`, `email`, `role` e `active: true`. Só um administrador deve fazer esta atribuição.

## Notas importantes
- Os 83 activos e 16 offline das câmaras são valores de referência importados do Excel de Outubro de 2026, não leituras actuais.
- A conectividade não é testada pela aplicação hospedada. A monitorização automática requer um agente/serviço local na rede, previsto para fase futura.
- `.1` a `.254` são os endereços de host inventariados; `.0` é o endereço de rede e `.255` o broadcast da sub-rede /24.
- Intervalos iniciais são sugestões de classificação; a aplicação permite ao administrador alterá-los.
- Confirme a política de backup e os utilizadores autorizados antes de usar em produção.

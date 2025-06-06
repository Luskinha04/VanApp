# VanApp
Aplicativo desenvolvido para facilitar a organização e gestão do transporte escolar.
=======
# UberVan 🚐

UberVan é um aplicativo mobile desenvolvido com React Native, Expo, e TypeScript para gerenciar o agendamento de viagens de vans escolares. O projeto suporta três tipos de usuários: administradores, motoristas e alunos.

## 🛠️ Tecnologias Utilizadas

### React Native com Expo:

Para desenvolvimento mobile.

### TypeScript:

Para maior robustez e tipagem estática.

### Firebase:

Para autenticação e banco de dados.

### EAS (Expo Application Services):

Para gerar builds e hospedar o aplicativo.

## UBERVAN/

```plaintext
UBERVAN/
├── .expo/                  # Configurações do Expo
├── .vscode/                # Configurações do editor
├── app/
│   ├── auth/               # Páginas principais por tipo de usuário logado
│   │   ├── admin.tsx       # Página do administrador
│   │   ├── aluno.tsx       # Página do aluno
│   │   ├── motorista.tsx   # Página do motorista
│   ├── edit/               # Funcionalidades de edição
│   │   ├── [type].tsx      # Lista de usuários por tipo
│   │   ├── editById.tsx    # Edição de um usuário específico
│   ├── login/              # Páginas de login
│   │   ├── [type].tsx      # Login dinâmico para cada tipo de usuário
│   ├── register/           # Cadastro de usuários
│   │   ├── [type].tsx      # Cadastro dinâmico de usuários
│   │   ├── index.tsx       # Página inicial do registro
├── assets/
│   ├── fonts/              # Fontes do aplicativo
│   ├── images/             # Imagens gerais
├── components/             # Componentes reutilizáveis
│   ├── Banner.tsx          # Banner com logo e imagem da van
│   ├── FormInput.tsx       # Campo de texto com label
│   ├── Header.tsx          # Cabeçalho com botão de logout
│   ├── LogoutBtn.tsx       # Botão de logout
├── typings/                # Arquivos de tipagem
│   ├── custom.d.ts         # Tipagens customizadas
├── scripts/                # Scripts auxiliares
├── firebaseConfig.js       # Configuração do Firebase
├── tsconfig.json           # Configuração do TypeScript
├── app.json                # Configurações do projeto Expo
├── README.md               # Documentação do projeto
```

## 🚀 Funcionalidades

### Usuários

#### Administrador:

Gerencia motoristas e alunos.
Acessa e edita informações de qualquer usuário.

#### Motorista:

Visualiza e gerencia suas viagens.
Atualiza informações pessoais.

#### Aluno:

Visualiza seu agendamento de viagens.
Autenticação

### Sistema de login dinâmico para diferentes tipos de usuários.

#### Gerenciamento

Cadastro de motoristas e alunos.
Edição de informações específicas por ID.

## 🔥 Firebase

O Firebase é utilizado para autenticação e armazenamento de dados no projeto. Abaixo estão os detalhes das funcionalidades integradas:

### Autenticação (Firebase Authentication)

Utilizado para gerenciar o login e registro de diferentes tipos de usuários (administradores, motoristas e alunos).

### Banco de Dados (Firestore Database)

Estruturado em duas coleções principais:

#### users:

Armazena os dados dos usuários cadastrados no sistema, incluindo tipo (admin, motorista ou aluno), nome, email, etc.

#### viagens:

Contém os registros de viagens, associando os usuários às suas viagens programadas.

## 📸 Componentes Visuais

#### Banner

Inclui a logo e uma imagem temática de van.

#### FormInput

Campo de texto reutilizável com suporte a labels.

#### Header

Exibe o cabeçalho do app com um botão para logout.

## EAS (Expo Application Services)

O projeto utiliza o EAS para gerar builds e hospedar o código do aplicativo. O EAS oferece uma solução prática e eficiente para compilar aplicativos nativos para iOS e Android.

### Configuração

#### O arquivo eas.json contém as configurações para os builds.

Perfil de desenvolvimento: usado para testes locais.
Perfil de produção: usado para gerar versões finais publicadas nas lojas.

##### Como gerar um build

Autenticar no Expo:

expo login

###### Gerar build para Android ou iOS:

Android:

`eas build --platform android`

iOS:

`eas build --platform ios`

###### Acompanhar o status do build:

Após iniciar o build, acompanhe o progresso no painel do EAS.

###### Hospedagem

Utilizando o EAS Update, o aplicativo recebe atualizações over-the-air (OTA) sem a necessidade de gerar novos builds.
Para publicar uma nova atualização:

`eas update --branch production`

###### 🎥 Vídeo de Apresentação

> *Assista ao vídeo explicativo sobre o projeto, suas funcionalidades e todas as etapas do desenvolvimento, desde a ideação até a publicação do APK:*

https://www.youtube.com/watch?v=Yvg4HovJMTg

# Portal de Servidores e App Parceiros

Portal de gerenciamento de servidores e aplicativos parceiros, com painel administrativo e interface pública para exibição de servidores disponíveis.

## 🚀 Como rodar localmente

### Pré-requisitos
- [PHP 8+](https://www.php.net/downloads)

### Iniciar o servidor

Execute o arquivo de inicialização na raiz do projeto:

```bash
# Windows
iniciar_servidor.bat
```

Ou acesse a pasta `Servidores Info/` e execute:

```bash
INICIAR_SERVIDOR.bat
```

O portal estará disponível em: **http://localhost:8080**

## 📁 Estrutura do Projeto

```
├── index.html              # Página principal (portal público)
├── partners.html           # Página de parceiros
├── partners-manager.html   # Painel administrativo
├── server.html             # Página individual de servidor
├── support.html            # Página de suporte
├── style.css               # Estilos globais
├── script.js               # Lógica do portal público
├── servers.js              # Dados dos servidores
├── iniciar_servidor.bat    # Script de inicialização (Windows)
├── abrir_portal.bat        # Abre o portal no navegador
├── assets/                 # Imagens e logos
└── Servidores Info/        # Backend PHP
    ├── admin.php           # Painel de administração
    ├── api.php             # API REST
    ├── db.php              # Conexão com banco de dados
    └── assets/             # Assets do admin
```

## 🔧 Configuração do Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução em `Servidores Info/database.sqlite`.

> ⚠️ O arquivo `database.sqlite` **não** é versionado por conter dados sensíveis.

## 📌 Funcionalidades

- ✅ Listagem pública de servidores disponíveis
- ✅ Filtros por categoria e número de telas
- ✅ Painel administrativo completo (CRUD de servidores)
- ✅ Gestão de aplicativos parceiros
- ✅ Upload de logos e assets
- ✅ API REST para integração

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** PHP 8 + SQLite
- **Servidor:** PHP Built-in Server

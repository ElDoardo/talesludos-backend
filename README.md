# Tales Ludos Backend (Node.js)

Backend refatorado da plataforma educacional *Tales Ludos*. 
Originalmente uma arquitetura MVC(*Model View Controller*) em Laravel, esta versão adota Node.js com uma arquitetura *Repository*. O projeto foi desenvolvido como parte de um Trabalho de Conclusão de Curso, que analisa os impactos da reengenharia e da migração arquitetural.

> **Relação Teórica do projeto:**  
> O artigo técnico-acadêmico que fundamenta este repositório pode ser [acessado aqui]().

---

## Sobre o Projeto

O projeto proposto visa construir uma ferramenta online de autoria que possibilite a construção de um jogo baseado em cenários, locais do cenário, personagens e interações, que exija pouco ou nenhum conhecimento técnico. Através do preenchimento de uma série de formulários, o autor tem a possibilidade de configurar o seu jogo. As escolhas devem ser flexíveis o suficiente para permitir a construção de jogos em áreas como história, geografia, matemática, química, biologia. Por exemplo, na área de história, o cenário pode ser o mapa na época do descobrimento, e as interações do jogo permitem a navegação por diversos momentos, locais e personagens do descobrimento. Ou ainda, na área de bioquímica, o cenário é um mapa metabólico e as interações possibilitam a navegação nos diversos locais das células, compostos e processos químicos envolvidos na respiração celular. O estudante/jogador que utilizar o jogo terá a possibilidade de interagir com os conceitos e fundamentos apresentados de forma lúdica nos cenários que forem criados. O objetivo é favorecer a usabilidade do programa, de modo que professores e estudantes com pouca fluência tecnológica consigam construir e usar os jogos. A ferramenta de autoria deve ainda contar com facilidades de exportação e publicação do jogo, de modo que o jogo construído possa ser utilizado nos mais diversos sistemas operacionais (linux, windows, ios) e nos mais diversos dispositivos (computadores, tablets, smartphones).  

---

## Tecnologias

- Node.js
- Express 
- Sequelize 
- JWT  
- Bcrypt
- Mailjet  
- MySQL 

## Arquitetura Adotada

O backend segue uma organização estruturada em:

- **Entity**  
  Representação das entidades de domínio.

- **Repository**  
  Acesso aos dados por interface, permitindo troca de implementações.

- **Service (Interface)**  
  Define regras de negócio de forma abstrata.

- **ServiceImpl**  
  Implementa a lógica definida na interface.

- **Controller**  
  Gerencia requisições HTTP e entrega respostas JSON.

---


## ▶️ Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/ElDoardo/talesludos-backend.git
```

### 2. Entrar no diretório
```bash
cd talesludos-backend
```

### 3. Instalar dependências
```bash
npm install
```

### 4. Configurar arquivo `.env`
Crie o arquivo `.env` a partir da `.env.example` alterando os campos necessários.

### 5. Rodar Migrations
```bash
npx sequelize-cli db:migrate
```

### 6. Rodar Projeto
```bash
npm start
```

---
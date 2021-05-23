<h1 align="center"><br>Self-Host<br></h1>

Não quer hospedar o bot ? convide-o [click-Here](https://discord.com/oauth2/authorize?client_id=838202798633517127&scope=bot&permissions=8)

## `1º` Get Start
- Depois de ter baixado o NodeJS você deverá editar os seguintes arquivos

>`src/config/config.example.js`
>`src/config/webhooks.example.js`

Preenchendo os devidos campos conforme o informado dentro dos arquivos.
- ⚠ Lembre-se de retirar o `example` dos nome dos arquivos!!

## `2º` DataBase
- Configuração do bancos de dados.
    - FireBase 
    > - `src/database/db.example.js`, Para o banco de dados será um processo diferente, você deverá se registrar no site [do banco de dados](https://firebase.google.com/) e seguir as seguintes opções, `Adicionar Projeto`, adicione o nome desejado para a aplicação, configure uma conta `Google Analytics`, depois de feito isso, vá em [RealTime DataBase](https://console.firebase.google.com/u/0/project/YOU_PROJECT_NAME_HERE/database), crie um banco de dados com as regras em modo de teste, entre nas configurações do banco de dados e vá em `seus aplicativos` e registre-se um, escolha o nome e copie as chaves geradas pelo banco de dados e as organize no arquivo.

## `2.1º` DataBase
- Configuração do bando de dados.
    - Mongodb
    > - Nosso segundo banco de dados usado é o [Mongodb](https://www.mongodb.com)
    > - Você precisará de uma [conta](https://www.mongodb.com/try) para proximas etapas.
    > Terminando de criar uma conta crie um cluster gratuito, de preferencia nos EUA.
    > - Em seguida espere as alterações no cluster serem efetuadas e clique no botão `connect`, após ter feito isso clique em `Allow Access from Anywhere` e `Add Ip Address`
    > - Crie um `Database User` depois navegue para `Choose a connection method` e `Connect your application` e copie o link fornecido.
    > - Depois de feito isso navegue até src/config/config.example.js e cole em `'mongodb//url'` substituindo `<password>` pela senha que você criou.

## `3º` Config.js
- Encontre o arquivo em `src/config/config.example.js` lembrando que você terá que retirar o `example` do arquivo.
- As APIs presentes no arquivo são Cruciais para o funcionamento do bot!!
- `SupportServer` será o servidor de suporte de seu bot
- Caso queira algo referente aos servidores acesse `src/database/models/GuildSettings`
- Para edição dos servidores lavalink entre em `src/base/Audio-Player` alterando o Host/Port/Password.
- Tenho 2 Projetos de servidores lavalink caso não queira optar por executalo em localhost [Heroku-24/7](https://github.com/HellpMe/Lavalink-Heroku-24-7), [Repli.it](https://github.com/HellpMe/Lavalink-Server-Repl.it), fique avontade para escolher o qual usar.

## `4º` **|** Execuções:

### 🔌 Instalação dos modulos
```shell 
? npm i
```
### 🔌 Inicialização 1º Passo, iniciar o bot:
```shell
? node .
```
### 🔌 Inicialização 2º Passo, iniciar o Servidor de Musica [Lavalink](https://github.com/freyacodes/Lavalink):
```shell
? npm run start:music
```
## Requisitos para execução do Lavalink-LocalHost!
- [JavaJDK](https://www.oracle.com/java/technologies/javase/jdk13-archive-downloads.html) or [Java-JDK²](https://adoptopenjdk.net/), requisito minimo JavaJDK 13+

## `5º` **|** Links:
🔗 Esses são os nossos únicos links. Então preste bastante atenção !!
> - [Twitter](https://twitter.com/CyberPlank_2077)
> - [Github](https://github.com/HellpMe)
> - [Servidor de Suporte](https://discord.tredux.xyz)


### Opcional! Servidor Lavalink-Heroku 24/7
- Caso queira usar um servidor de musica `não usando o interno`, recomendo que leia este repositorio explicando passa-a-passo, em caso de duvidas entre em contato via [Issues](https://github.com/HellpMe/Lavalink-Heroku-24-7/issues).
- [Lavalink-Heroku-24/7](https://github.com/HellpMe/Lavalink-Heroku-24-7).


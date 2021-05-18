//Puxando os modulos
const Discord = require('discord.js'),
    ejs = require('ejs'),
    url = require('url'),
    path = require('path'),
    express = require('express'),
    passport = require('passport'),
    { readdirSync } = require('fs'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo'),
    Strategy = require('passport-discord').Strategy;
    
//vamos começar puxando express
const app = express();
app.use(express.static('../dashboard/static'));
//puxar as configs
const config = require('../src/config/dashboarsettings')
//enviar msg de start no console
console.log('Dashboard Starded...');
//Get start
module.exports = async (client) => {
    console.log('Configurando a dashboard, aguarde!');
    //puxando as pastas
    const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
    const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
    //iniciando o 'passport'
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(new Strategy({
        clientID: `${config.clientID}`,
        clientSecret: `${config.secret}`,
        callbackURL: `${config.domain}/callback`,
        scope: ["identify", "guilds"]
      },
    (accessToken, refreshToken, profile, done) => { 
        process.nextTick(() => done(null, profile));
    }));
    //armazenando o cache no mongodb
    app.use(session({
        secret: 'abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVXWYZ1234567890',
        resave: true,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: config.mongoUrl })
    }));
    //iniciando novamente o 'passport' agora para configurar a linguagem que vamos usar 'ejs'
    app.use(passport.initialize());
    app.use(passport.session());
    app.locals.domain = config.domain.split("//")[1];
    //engine que vamos usar para criar//renderizar a dashboard
    app.engine("html", ejs.renderFile);
    //setando a engine de visualização
    app.set("view engine", "html");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
     extended: true
    }));
    //templates de renderização//dados
    const renderTemplate = (res, req, template, data = {}) => {
        var hostname = req.headers.host;
        var pathname = url.parse(req.url).pathname;
        const baseData = {
            https: "https://",
            domain: config.domain,
            bot: client,
            config: config,
            hostname: hostname,
            pathname: pathname,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            verification: config.verification,
            description: config.description,
            url: res,
            req: req,
            image: `${config.domain}/logo.png`,
            name: client.username,
            tag: client.tag,
            arc: config.arc,
            analitics: config.google_analitics,
        };
        res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    };
    console.log('Iniciando EndPoints...');
    const checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
       }
    //endpoint de login
    app.get("/login", (req, res, next) => {
        if (req.session.backURL) {
            req.session.backURL = req.session.backURL;
        } else if (req.headers.referer) {
    const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
            req.session.backURL = parsed.path;
    }
        } else {
            req.session.backURL = "/";
        } 
        next();
},
passport.authenticate("discord"));

//callback endpoint
app.get("/callback", passport.authenticate("discord", {
    failureRedirect: "/"
   }), (req, res) => {
    if (req.session.backURL) {
    const url = req.session.backURL;
    req.session.backURL = null;
    res.redirect(url);
    } else {
    res.redirect("/");
    }
});
// Features list redirect endpoint.
app.get("/features", (req, res) => {
    renderTemplate(res,  req, "features.ejs", {
     readdirSync: readdirSync,
     perms: Discord.Permissions
    });
   });
app.get("/status", (req, res) => {
    renderTemplate(res, req, "status.ejs");
});
app.get("/faq", (req, res) => {
    renderTemplate(res, req, "faq.ejs");
});
app.get("/support", (req, res) => {
    res.redirect(`https://discord.gg/FqdH4sfKBg`)
});
app.get("/server", (req, res) => {
    res.redirect(`https://discord.gg/FqdH4sfKBg`)
});
app.get('/invite', function(req, res) {
    res.redirect(`https://discord.com/oauth2/authorize?client_id=${config.clientID}&redirect_uri=${config.domain}/thanks&response_type=code&scope=bot&permissions=490073207`)
});
app.get('/thanks', function(req, res) {
    renderTemplate(res, req, "thanks.ejs")
});
app.get("/team", (req, res) => {
    renderTemplate(res, req, "team.ejs")
});  
app.get("/policy", (req, res) => {
    renderTemplate(res, req, "policy.ejs")
});
if (config.github && config.repo) {
app.get("/github", (req, res) => {
    res.redirect(`https://github.com/` + config.github + "/" + config.repo);
});
}
if (config.status) {
app.get("/host-status", (req, res) => {
    res.redirect(config.status);
});
}
//endpoint logout
app.get("/logout", function(req, res) {
    // Destruindo a sessão logout
  req.session.destroy(() => {
    req.logout();
    res.redirect("/");
   });
  });
app.get("/window", (req, res) => {
    renderTemplate(res, req, "window.ejs");
});
//endpoint da index
app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs");
});
//endpoint da dashboard
app.get("/dashboard", checkAuth, (req, res) => {
    renderTemplate(res, req, "dashboard.ejs", {
    perms: Discord.Permissions
    });
   });
 // caso de algum erro na dashboard
app.get("/error", (req, res) => {
    renderTemplate(res,  req, "error.ejs", {
    perms: Discord.Permissions
    });
   });
//endpoint das configurações
app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
 // Valide o pedido, verifique se a guilda existe, o membro está na guilda e se o membro tem permissões mínimas
const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/error");
const member = guild.members.cache.get(req.user.id);
    if (!member) return res.redirect("/error");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/error");
renderTemplate(res, req, "server.ejs", {
    guild: guild,
    });
   });
//404
app.use(function(req, res, next){
    res.status(404);
    renderTemplate(res, req, '404.ejs');
    });
    console.log('Todas configurações efetuadas, Iniciando Dashboard!');
    app.listen(config.port, null, null, () => console.log(`DashBoard Iniciada na porta: ${config.port}.`));
}
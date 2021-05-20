//Puxando os modulos
const Discord = require('discord.js'),
    ejs = require('ejs'),
    url = require('url'),
    path = require('path'),
    cooldownNickname = new Set(),
    express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    { readdirSync } = require('fs'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo'),
    Strategy = require('passport-discord').Strategy;

    //Mongodb Schemas
    const { GuildSchema } = require('../src/database/models');
    
//vamos começar puxando express
const app = express();
app.use(express.static('dashboard/static'));
//puxar as configs//porta
const config = require('../src/config/dashboarsettings');
//enviar msg de start no console
console.log('Dashboard Starded...');

module.exports = async (client) => {
  console.log('Configurando a dashboard, aguarde!');
//puxando as pastas
const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
//iniciando o 'passport'
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new Strategy({
clientID: config.clientID,
clientSecret: config.clientSecret,
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
        bot: client,
        config: config,
        hostname: hostname,
        pathname: pathname,
        path: req.path,
        user: req.isAuthenticated() ? req.user : null,
        verification: config.verification,
        description: config.description,
        domain: config.domain,
        url: res,
        title: client.username,
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

 // Callback endpoint.
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
 // Github redirect endpoint.
 if (config.github && config.repo) {
 app.get("/github", (req, res) => {
  res.redirect(`https://github.com/` + config.github + "/" + config.repo);
  });
 }

 // External status page redirect endpoint.
 if (config.status) {
 app.get("/host-status", (req, res) => {
  res.redirect(config.status);
  });
 }

 // Status page endpoint.
 if (config.status) {
  app.get("/status", (req, res) => {
   renderTemplate(res, req, "status.ejs");
  });
 }

 // Logout endpoint.
 app.get("/logout", function(req, res) {
  //como ja diz para encerrar o login
  req.session.destroy(() => {
   req.logout();
   res.redirect("/");
  });
 });

 // Index endpoint.
 app.get("/", (req, res) => {
  renderTemplate(res, req, "index.ejs");
 });

 // Dashboard endpoint.
 app.get("/dashboard", checkAuth, (req, res) => {
  renderTemplate(res, req, "dashboard.ejs", {
   perms: Discord.Permissions
  });
 });

 // Dashboard error handler
 app.get("/error", (req, res) => {
  renderTemplate(res,  req, "error.ejs", {
   perms: Discord.Permissions
  });
 });
//endpoint das configurações
app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
    // Valide o pedido, verifique se a guilda existe, o membro está na guilda e se o membro tem permissões mínimas
   const guild = client.guilds.cache.get(req.params.guildID);
       if (!guild) return res.redirect("/dashboard");
   const member = guild.members.cache.get(req.user.id);
       if (!member) return res.redirect("/dashboard");
       if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    var storedSettings = await GuildSchema.findOne({ guildID: guild.id});
    if (!storedSettings) {
        const newSettings = new GuildSchema({
            guildID: guild.id
        });
        await newSettings.save().catch(() => { });
        storedSettings = await GuildSchema.findOne({ guildID: guild.id });
    }
    const join1 = []
    const leave1 = []
    const join2 = []
    const leave2 = []

  guild.members.cache.forEach(async(user)=>{
  let day = 7 * 86400000;
  let x = Date.now() - user.joinedAt;
  let created = Math.floor(x / 86400000);

  if(7 > created) {
  join2.push(user.id)
  }
     if(1 > created) {
  join1.push(user.id)
  }
   })

  storedSettings.leaves.forEach(async(leave)=>{

  let xx = leave - Date.now();
  if(Date.now() > leave){
    xx = Date.now() - leave
  }
  let createdd = Math.floor(xx / 86400000);
  if(6 >= createdd) {
  leave2.push(leave)
  }
     if(0 >= createdd) {
  leave1.push(leave)
  }
   })
   renderTemplate(res, req, "./new/mainpage.ejs", {
    guild: guild,
    alert: `O painel pode estar um pouco cheio de erros devido a problemas de intent do discord.`,
    join1:join1.length || 0,
    join2: join2.length || 0,
    leave1: leave1.length || 0,
    leave2: leave2.length || 0,
    nickname: guild.me.nickname || guild.me.user.username,
    settings: storedSettings,
  });
});
app.post("/dashboard/:guildID", checkAuth, async (req, res) => {

    const guild = client.guilds.cache.get(req.params.guildID);
    if (!guild) return res.redirect("/dashboard");
    const member = await guild.members.fetch(req.user.id);
    if (!member) return res.redirect("/dashboard");
    if (!member.permissions.has("MANAGE_GUILD")) return res.redirect("/dashboard");

    var storedSettings = await  GuildSchema.findOne({ guildID: guild.id });
    if (!storedSettings) {

      const newSettings = new GuildSchema({
        guildID: guild.id
      });
      await newSettings.save().catch(() => { });
      storedSettings = await GuildSchema.findOne({ guildID: guild.id });
    }
    const join1 = []
    const leave1 = []
    const join2 = []
    const leave2 = []

  guild.members.cache.forEach(async(user)=>{

  let day = 7 * 86400000;
  let x = Date.now() - user.joinedAt;
  let created = Math.floor(x / 86400000);
  
  if(7 > created) {
  join2.push(user.id)
  }
     if(1 > created) {
  join1.push(user.id)
  }
   })
       storedSettings.leaves.forEach(async(leave)=>{
  let xx = leave - Date.now();
  if(Date.now() > leave){
    xx = Date.now() - leave
  }
  let createdd = Math.floor(xx / 86400000);

  if(6 >= createdd) {
  leave2.push(leave)
  }
     if(0 >= createdd) {
  leave1.push(leave)
  }
   })
    //Nickname 
    let data = req.body
    let nickname = data.nickname
    if (nickname && nickname.length < 1) nickname = guild.me.nickname || guild.me.user.username;

    if (data.nickname) {
      if (cooldownNickname.has(guild.id)) nickname = guild.me.nickname || guild.me.user.username
      if (!nickname) nickname = guild.me.nickname || guild.me.user.username

      guild.me.setNickname(nickname);
      cooldownNickname.add(guild.id)
      setTimeout(() => {
        cooldownNickname.delete(guild.id)
      }, 20000)
    }


    if (data.prefix) {
      let prefix = data.prefix.replace(/ /g, "")
      if (!prefix) prefix = storedSettings.prefix
      if (prefix.length > 5) {
        renderTemplate(res, req, "./new/mainpage.ejs", {
          guild: guild,
          nickname: nickname,
           join1:join1.length || 0,
      join2: join2.length || 0,
      leave1: leave1.length || 0,
      leave2: leave2.length || 0,
          alert: "Prefixo não pode conter mais que 5 Caracteres! ❌",
          settings: storedSettings,
        });
        return;
      }
      storedSettings.prefix = prefix
    } else {
      storedSettings.prefix = storedSettings.prefix
    }

    if (data.Language) {
      const Languages = ["Portugues", "english", "french", "spanish"]
      let Language = data.Language
      if (!Language) Language = "Portugues";
      if (!Languages.includes(Language)) Language = "Portugues";

      storedSettings.Language = Language
    }

    await storedSettings.save().catch(() => { })

    renderTemplate(res, req, "./new/mainpage.ejs", {
      guild: guild,
      join1:join1.length || 0,
      join2: join2.length || 0,
      leave1: leave1.length || 0,
      leave2: leave2.length || 0,
      nickname: nickname,
      alert: "Suas Alterações foram efetuadas com sucesso! ✅",
      settings: storedSettings,
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
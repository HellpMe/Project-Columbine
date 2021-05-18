// permissões
const permissions = require('../permissions.json');

const languageData = {
	ERROR_MESSAGE: 'Ocorreu um erro ao executar este comando, tente novamente ou entre em contato com o suporte.',
	INCORRECT_FORMAT: (commandExample) => `Use o formato: \`${commandExample}\`.`,
	MISSING_PERMISSION: (permission) => `Estou sem a permissão: \`${permissions[permission]}\`.`,
	USER_PERMISSION: (permission) => `Você está faltando a permissão de: \`${permissions[permission]}\`.`,
	MISSING_ROLE: 'Não consegui encontrar esse cargo.',
	NO_REASON: 'Nenhuma razão dada.',
};

const translate = (key, args) => {
	const translation = languageData[key];
	if(typeof translation === 'function') return translation(args);
	else return translation;
};

module.exports = translate;
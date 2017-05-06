function load(templateName) {
    const cacheObj = {};

    return new Promise((reslove, reject) => {
        if (cacheObj.hasOwnProperty(templateName)) {

            resolve(cacheObj[templateName]);
        }
    })


    return getRequest(`js/templates/${templateName}.handlebars`)
        .then(template => {
            const compiledTemplate = Handlebars.compile(template);
            cacheObj[templateName] = compiledTemplate;
            return Promise.resolve(compiledTemplate);
        });
}
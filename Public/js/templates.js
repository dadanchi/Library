function loadTemplate(templateName) {
    const cacheObj = {};

    return new Promise((resolve, reject) => {
        if (cacheObj.hasOwnProperty(templateName)) {

            resolve(cacheObj[templateName]);
        } else {
            $.get(`../templates/${templateName}.handlebars`, templateHtml => {
                var template = Handlebars.compile(templateHtml);
                cacheObj[name] = template;
                resolve(template);
            });

        }
    })
}
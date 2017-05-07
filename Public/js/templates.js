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


/*
function compile(data) {
    var result = loadTemplate(templateName).then(template => {
        var templateFunction = Handlebars.compile(template);
        return templateFunction(data);
    });

    return result;
}
*/

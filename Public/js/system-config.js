System.config({
    transpiler: 'plugin-babel',
    map: {
        // System.js files
        'plugin-babel': 'libs/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'libs/systemjs-plugin-babel/systemjs-babel-browser.js',

        // Library files
        'jquery': 'node_modules/jquery/dist/jquery.min.js',
        'handlebars': 'node_modules/handlebars/dist/handlebars.amd.js',
        //'cryptojs': 'node_modules/crypto-js/sha1.js',
        //'toastr': 'node_modules/toastr/toastr.js',
        'bootstrap': 'node_modules/bootstrap/dist/js/bootstrap.min.js',
    }
});
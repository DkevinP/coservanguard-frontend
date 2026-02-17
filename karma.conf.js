// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'), // <--- ESTE ES EL IMPORTANTE
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // puedes añadir opciones de jasmine aquí
        // ej: random: false
      },
      clearContext: false // deja visible la salida del test en el navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // elimina los rastros duplicados
    },
    // --- CONFIGURACIÓN DEL REPORTE DE COBERTURA ---
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' }, // Crea la página web bonita
        { type: 'text-summary' } // Muestra resumen en consola
      ]
    },
    // ---------------------------------------------
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};

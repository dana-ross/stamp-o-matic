module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ttf2woff: {
      default: {
        src: ['fonts/billy-argel_masterplan/MASTERPLAN___.ttf', 'fonts/capture_it/capture it.ttf', 'fonts/d_day_stencil/D Day Stencil.ttf'],
        dest: 'fonts/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-ttf2woff');

  // Default task(s).
  grunt.registerTask('default', ['ttf2woff']);

};

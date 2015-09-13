var shell = require('shelljs');

shell.config.silent = true;
shell.rm('-rf', 'tmp');
shell.mkdir('tmp');
shell.cd('tmp');

shell.mkdir('git-templates');
shell.mkdir('test');
shell.mkdir('angular');
shell.mkdir('jquery');
shell.mkdir('jshint');
shell.mkdir('eslint');
shell.mkdir('atom');
shell.mkdir('express');
shell.mkdir('jscs');
shell.mkdir('ember');
shell.mkdir('codemirror');
shell.mkdir('cli');

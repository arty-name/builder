var path = require('path');

// converts CJS into something that will define itself onto the loader

function cjsOutput(name, deps, address, source, baseURL) {
  var filename = path.relative(baseURL, address);
  var dirname = path.dirname(filename);

  return 'System.register("' + name + '", ' + JSON.stringify(deps) + ', true, function(require, exports, __moduleName) {\n'
    + '  var global = System.global;\n'
    + '  var __define = global.define;\n'
    + '  global.define = undefined;\n'
    + '  var module = { exports: exports };\n'
    + '  var process = System.get("@@nodeProcess")["default"];\n'
    + '    var __filename = "' + filename + '";\n'
    + '    var __dirname = "' + dirname + '";\n'
    + '  ' + source.replace(/\n/g, '\n  ') + '\n'
    + '  global.define = __define;\n'
    + '  return module.exports;\n'
    + '});\n'
}

exports.compile = function(load, loader) {
  return Promise.resolve({
    source: cjsOutput(load.name, load.metadata.deps, load.address, load.source, loader.baseURL)
  });
}
const path = require('path');

function resolveDependency(loader, context, chunkPath) {
  return new Promise((resolve, reject) => {
    loader.resolve(context, chunkPath, (err, res) => {
      if(err) reject(err);
      else resolve(res);
    });
  });
}

module.exports = function(source) {
  if (this.cacheable) this.cacheable();
  const callback = this.async();

  // Match all occurences of various texture/image formats
  var pattern = /^\s*("uri"\s*:\s*).*/gm;
  var matches = source.match(pattern);
  var trimmedMatches = [];

  if (matches && typeof matches.filter === 'function') {
    // Make them unique
    var uniqueMatches = matches.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    // Trim away matched space at first char
    trimmedMatches = uniqueMatches.map(item =>
      item.trim().replace(/^\s*("uri"\s*:\s*)/, '').replace(/"|,/g, '')
    );
  }
  // add dependencies to this loader
  let promises = []
  trimmedMatches.forEach((item) => {
    promises.push(resolveDependency(this, path.dirname(this.resource), './' + item))
  })

  // resolve dependencies
  Promise.all(promises).then((dependencies) => {
    // add dependencies
    dependencies.forEach(dependency => {
      this.addDependency(dependency)
    })

    // prepare result
    var result = '';

    // trim source of all newlines and spaces
    var gltfString = source.replace( new RegExp('(\n|\r|\t| )', 'gm'), "");

    for (let i = 0; i < trimmedMatches.length; i++) {
      // add a require statement to result
      result = result.concat("var asset" + i + " = require('./" + trimmedMatches[i] + "');\n");
      // replace require in gltfString
      gltfString = gltfString.replace( new RegExp(trimmedMatches[i], 'g'), "' + asset" + i + " + '" )
    }
    // add export gltf string
    result = result.concat('module.exports = \'' + gltfString + '\';\n')
    // callback
    callback(null, result)

  }).catch((err) => {
    // some dependencies errored
    callback(err)
  })
};

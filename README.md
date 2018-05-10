# Webpack GLTF loader 2

A webpack loader for ``.gltf`` files, should automatically bundles all referenced files.

Based on the work by [Magnus Bergman](https://github.com/magnus-bergman) but rewritten almost from scratch.

https://www.npmjs.com/package/gltf-loader this is his original loader that didn't work for me when I tried so I decided to rewrite it.

(it also doesn't have a valid github repository to contribute to, as of today, 10/05/2018)

**WARNING: this is pretty much untested and alpha version, contrubutions appreciated**

## Webpack configuration 

``` js
rules: [
  // IMPORTANT: if you have a loader for Image files (you would, normally)
  // you NEED to add an exclude option IN IT for GLTF images
  {
    // following is an example of YOUR loader config
    test: /\.(png|jpe?g|gif)(\?.*)?$/,
    // here I decided to put all my gltf files under a folder named 'gltf'
    // so I added and exclude rule to my existing loader
    exclude: /gltf/, // only add this line
    // (etc)
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'img/[name].[hash:7].[ext]'
    }
  },
  // GLTF configuration: add this to rules
  {
    // match all .gltf files
    test: /\.(gltf)$/,
    loader: 'gltf-loader-2'
  },
  {
    // here I match only IMAGE and BIN files under the gltf folder
    test: /gltf.*\.(bin|png|jpe?g|gif)$/,
    // or use url-loader if you would like to embed images in the source gltf
    loader: 'file-loader',
    options: {
      // output folder for bin and image files, configure as needed
      name: 'gltf/[name].[hash:7].[ext]'
    }
  }
  // end GLTF configuration
]
```

## Usage Example in Three.js

 ``` js
 // please notice the file and all its dependencies 
 // are under a folder named 'gltf' as per webpack config
import gltfFile from 'assets/gltf/some.gltf';
// per configuration only the GLTF json het embedded in the source
// .bin and .png images are processed and outputted by webpack

var loader = new GLTFLoader()
loader.parse(shieldGLTF, '', (gltf) => {
  // here we go
  let scene = gltf.scene
})
 ```

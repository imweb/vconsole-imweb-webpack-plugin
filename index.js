/**
 * webpack plugin for vConsole tools
 *
 * @author long
 * @date 2017/9/26
 * @ref https://github.com/Tencent/vConsole
 * @ref https://github.com/WechatFE/vConsole-elements
 * @ref https://github.com/WechatFE/vConsole-resources
 * 
 */

'use strict';

const path = require('path');

function vConsolePlugin(options) {
    this.options = Object.assign({
        noElements: false,
        noResources: false
    }, options);
}

vConsolePlugin.prototype.apply = function (compiler) {
    const noElements = this.options.noElements;
    const noResources = this.options.noResources;
    let _root = path.join(compiler.context, '/node_modules'); // base to $project/node_modules

    // support resolveLoader.root
    if (compiler.options.resolveLoader && compiler.options.resolveLoader.root) {
        _root = compiler.options.resolveLoader.root;
    }

    const pathVconsole = path.join(_root, '/vconsole/dist/vconsole.min.js');
    const pathVconsoleElements = path.join(_root, '/vconsole-elements/dist/vconsole-elements.min.js');
    const pathVconsoleResources = path.join(_root, '/vconsole-resources/dist/vconsole-resources.min.js');

    compiler.plugin('entry-option', function () {
        if (Object.prototype.toString.call(this.options.entry) === '[object Array]') {
            !noResources && this.options.entry.unshift(pathVconsoleResources);
            !noElements && this.options.entry.unshift(pathVconsoleElements);
            this.options.entry.unshift(pathVconsole);
        } else if (typeof this.options.entry === 'object') {
            for (let key in this.options.entry) {
                if (Object.prototype.toString.call(this.options.entry[key]) === '[object Array]') {
                    !noResources && this.options.entry.unshift(pathVconsoleResources);
                    !noElements && this.options.entry.unshift(pathVconsoleElements);
                    this.options.entry[key].unshift(pathVconsole);
                } else if (typeof this.options.entry[key] === 'string') {
                    this.options.entry[key] = [this.options.entry[key]];
                    !noResources && this.options.entry[key].unshift(pathVconsoleResources);
                    !noElements && this.options.entry[key].unshift(pathVconsoleElements);
                    this.options.entry[key].unshift(pathVconsole);
                }
            }
        }
    });
};

module.exports = vConsolePlugin;

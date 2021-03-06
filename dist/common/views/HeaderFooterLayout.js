/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Entity = require('../core/Entity');
var RenderNode = require('../core/RenderNode');
var Transform = require('../core/Transform');
var OptionsManager = require('../core/OptionsManager');
function HeaderFooterLayout(options) {
    this.options = Object.create(HeaderFooterLayout.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);
    if (options)
        this.setOptions(options);
    this._entityId = Entity.register(this);
    this.header = new RenderNode();
    this.footer = new RenderNode();
    this.content = new RenderNode();
}
HeaderFooterLayout.DIRECTION_X = 0;
HeaderFooterLayout.DIRECTION_Y = 1;
HeaderFooterLayout.DEFAULT_OPTIONS = {
    direction: HeaderFooterLayout.DIRECTION_Y,
    headerSize: undefined,
    footerSize: undefined,
    defaultHeaderSize: 0,
    defaultFooterSize: 0
};
HeaderFooterLayout.prototype.render = function render() {
    return this._entityId;
};
HeaderFooterLayout.prototype.setOptions = function setOptions(options) {
    return this._optionsManager.setOptions(options);
};
function _resolveNodeSize(node, defaultSize) {
    var nodeSize = node.getSize();
    return nodeSize ? nodeSize[this.options.direction] : defaultSize;
}
function _outputTransform(offset) {
    if (this.options.direction === HeaderFooterLayout.DIRECTION_X)
        return Transform.translate(offset, 0, 0);
    else
        return Transform.translate(0, offset, 0);
}
function _finalSize(directionSize, size) {
    if (this.options.direction === HeaderFooterLayout.DIRECTION_X)
        return [
            directionSize,
            size[1]
        ];
    else
        return [
            size[0],
            directionSize
        ];
}
HeaderFooterLayout.prototype.commit = function commit(context) {
    var transform = context.transform;
    var origin = context.origin;
    var size = context.size;
    var opacity = context.opacity;
    var headerSize = this.options.headerSize !== undefined ? this.options.headerSize : _resolveNodeSize.call(this, this.header, this.options.defaultHeaderSize);
    var footerSize = this.options.footerSize !== undefined ? this.options.footerSize : _resolveNodeSize.call(this, this.footer, this.options.defaultFooterSize);
    var contentSize = size[this.options.direction] - headerSize - footerSize;
    if (size)
        transform = Transform.moveThen([
            -size[0] * origin[0],
            -size[1] * origin[1],
            0
        ], transform);
    var result = [
        {
            size: _finalSize.call(this, headerSize, size),
            target: this.header.render()
        },
        {
            transform: _outputTransform.call(this, headerSize),
            size: _finalSize.call(this, contentSize, size),
            target: this.content.render()
        },
        {
            transform: _outputTransform.call(this, headerSize + contentSize),
            size: _finalSize.call(this, footerSize, size),
            target: this.footer.render()
        }
    ];
    return {
        transform: transform,
        opacity: opacity,
        size: size,
        target: result
    };
};
module.exports = HeaderFooterLayout;
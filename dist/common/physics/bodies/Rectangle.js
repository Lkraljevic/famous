/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Body = require('./Body');
var Matrix = require('../../math/Matrix');
function Rectangle(options) {
    options = options || {};
    this.size = options.size || [
        0,
        0
    ];
    Body.call(this, options);
}
Rectangle.prototype = Object.create(Body.prototype);
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.setSize = function setSize(size) {
    this.size = size;
    this.setMomentsOfInertia();
};
Rectangle.prototype.setMomentsOfInertia = function setMomentsOfInertia() {
    var m = this.mass;
    var w = this.size[0];
    var h = this.size[1];
    this.inertia = new Matrix([
        [
            m * h * h / 12,
            0,
            0
        ],
        [
            0,
            m * w * w / 12,
            0
        ],
        [
            0,
            0,
            m * (w * w + h * h) / 12
        ]
    ]);
    this.inverseInertia = new Matrix([
        [
            12 / (m * h * h),
            0,
            0
        ],
        [
            0,
            12 / (m * w * w),
            0
        ],
        [
            0,
            0,
            12 / (m * (w * w + h * h))
        ]
    ]);
};
module.exports = Rectangle;
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var EventHandler = require('../core/EventHandler');
function EventFilter(condition) {
    EventHandler.call(this);
    this._condition = condition;
}
EventFilter.prototype = Object.create(EventHandler.prototype);
EventFilter.prototype.constructor = EventFilter;
EventFilter.prototype.emit = function emit(type, data) {
    if (this._condition(type, data))
        return EventHandler.prototype.emit.apply(this, arguments);
};
EventFilter.prototype.trigger = EventFilter.prototype.emit;
module.exports = EventFilter;
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';


var _tiles = [];


function generateTiles() {
    var images = [];
    for (var i = 1; i < 9; i++) {
        images.push("images/" + i + ".jpg");
    }
    images = _.shuffle(images);
    images = images.concat(images);
    for (i = 0; i < images.length; i++) {
        _tiles.push({
            image: images[i],
            flipped: false,
            matched: false
        });
    }
}

function clickTile(targetId) {
    /**
     * Flip the tile
     */
    _tiles[targetId].flipped = true;


}

function matchCheck() {
    var flipped = [];

    /**
     * Check if there is any matching tile
     */

    for (var id in _tiles) {

        if (_tiles[id].flipped === true && _tiles[id].matched === false) {
            flipped.push(id);
        }

    }

    if (flipped.length < 2) return;

    if (_tiles[flipped[0]].image === _tiles[flipped[1]].image) {
        _tiles[flipped[0]].matched = true;

        _tiles[flipped[1]].matched = true;


    } else {
        _tiles[flipped[0]].flipped = false;

        _tiles[flipped[1]].flipped = false;

    }
}
var TileStore = assign({}, {


    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    getAll: function () {
        return _tiles;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    getFirstFlipIndex: function () {

        var firstFlipIndex = null;

        for (var id in _tiles) {
            if (_tiles[id].flipped === true && _tiles[id].matched === false) {
                firstFlipIndex = id;
            }
        }

        return firstFlipIndex;
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

generateTiles();


/**
 * When a tile is clicked
 */

module.exports = TileStore;

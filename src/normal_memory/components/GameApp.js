var React = require('react');
var TileStore = require('../stores/TileStore');
var MessageStore = require('../stores/MessageStore');
var Tile = require('./Tile.js');
var Status = require('./Status.js');
require('../../css/styles.css');
var update = require('react-addons-update');
var assign = require('object-assign');

/**
 * Retrieve the current TODO data from the TodoStore
 */
var _messages = {
  choosetile: 'Choose a tile!',
  findmate: 'Now try to find the matching tile!',
  wrong: 'Sorry, those didn\'t match!',
  foundmate: 'Yey, they matched!',
  foundall: 'You\'ve found all pairs! Well done!'
};

var _message = _messages.choosetile;
var GameApp = React.createClass({

    getInitialState: function () {
        return {
            allTiles: TileStore.getAll(),
            message: MessageStore.getMessage(),
            isWaiting: false
        };
    },

    updateMessage: function() {

      var flipped = [];
      var tiles =  this.state.allTiles;
      var allMatched = true;

      /**
       * Check if there is any matching tile
       */
      for (var id in tiles) {

        if (tiles[id].matched === false) allMatched = false;

        if (tiles[id].flipped === true && tiles[id].matched === false) {
          flipped.push(id);
        }

      }

      if (allMatched) {
        _message = _messages.foundall;
      }

      if(flipped.length === 0) {
        _message = _messages.choosetile;
      }
      else if(flipped.length === 1) {
        _message = _messages.findmate;
      }

      else if (tiles[flipped[0]].image === tiles[flipped[1]].image) {

        _message = _messages.foundmate;

      } else {

        _message = _messages.wrong;

      }
      this.setState({
        message: _message
      });

    },

    matchCheck :function () {
      var flipped = [];

      /**
       * Check if there is any matching tile
       */
      var _tiles = assign({},this.state.allTiles);

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
      this.setState(_tiles);
    },
    onTileClick: function (index) {
        if(this.state.isWaiting) return;
        if(TileStore.getFirstFlipIndex() !== null) {
            this.setState({
                isWaiting: true
            });
        }
        var newState =  assign({}, this.state);
        newState.allTiles[index].flipped = true;
        var that = this;
        this.setState(newState, () =>{
          that.updateMessage();
        });
        setTimeout(function () {
          this.matchCheck();
          this.updateMessage();
          this.setState({
            isWaiting: false
          });
        }.bind(this), 2000);
    },
    render: function () {
        // This section should be hidden by default
        // and shown when there are tiles.
        if (Object.keys(this.state.allTiles).length < 1) {
            return null;
        }

        var allTiles = this.state.allTiles;
        var tiles = [];

        for (var id in allTiles) {
            id = parseInt(id);
            tiles.push(<Tile key={id} onTileClick={this.onTileClick} id={id} image={allTiles[id].image} flipped={allTiles[id].flipped} />);
        }

        return (
            <section id="main">
                <Status message={this.state.message} />
                {tiles}
            </section>
        );
    }


});

module.exports = GameApp;

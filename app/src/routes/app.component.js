import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {AppBar, Paper} from 'material-ui';
import {range} from 'lodash';
import {TweenMax, TimelineMax} from 'gsap';
import {List, Map, OrderedSet} from 'immutable';
import classnames from 'classnames';
import {
  red500, pink500, purple500, deepPurple500, indigo500, blue500, lightBlue500, cyan500, teal500, green500,
  lightGreen500, lime500, yellow500, amber500, orange500, blueGrey50
} from 'material-ui/styles/colors';


export class App extends Component {
  constructor(props) {
    super(props);
    const colors = List([red500, pink500, purple500, deepPurple500, indigo500, blue500, lightBlue500, cyan500, teal500,
      green500, lightGreen500, lime500, yellow500, amber500, orange500]);
    const tiles = List(_.range(15).map((id) => Map({id, color: colors.get(id)})));
    const selectedTile = null;
    this.state = {tiles, selectedTile};
    this.paperRefs = OrderedSet();
  }

  componentWillUpdate() {
    this.papersData = this.paperRefs.map((ref) => {
      const domNode = findDOMNode(ref);
      const oldBox = domNode.getBoundingClientRect();
      return {ref, oldBox};
    });
  }

  componentDidUpdate() {
    this.papersData.forEach(({ref, oldBox}) => {
      const domNode = findDOMNode(ref);
      const newBox = domNode.getBoundingClientRect();

      requestAnimationFrame(() => {
        const x = oldBox.left - newBox.left;
        const y = oldBox.top - newBox.top;
        const scaleX = oldBox.width / newBox.width;
        const scaleY = oldBox.height / newBox.height;

        domNode.style.transform = `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`;
        domNode.style.transformOrigin = '0 0';
        domNode.style.transition = 'transform 0s';

        requestAnimationFrame(() => {
          domNode.style.transform = '';
          domNode.style.transition = 'transform 2000ms';
        });
      });
    });
  }

  componentDidMount() {
    const stagger = 0.075;
    new TimelineMax({
      tweens: this.paperRefs.toList().map((ref, index) => TweenMax.fromTo(findDOMNode(ref), 0.5, {
        opacity: 0,
        y: 10
      }, {
        opacity: 1,
        y: 0,
        delay: 0.5 + stagger * (Math.floor(index / 4) + index % 4)
      }))
    })
  }

  renderTile(tile) {
    const saveRef = (ref) => {
      if (!ref) {
        return;
      }
      this.paperRefs = this.paperRefs.add(ref);
    };

    const cssClasses = classnames('tile', {
      'tile--active': tile === this.state.selectedTile
    });

    return (
      <div key={tile.get('id')} className={cssClasses} onTouchTap={() => this.onTileClicked(tile)}>
        <Paper className="tile__paper" ref={saveRef}
               style={{transition: undefined, backgroundColor: tile.get('color')}}
        />
      </div>
    );
  }

  render() {
    let tiles = this.state.tiles;
    if (this.state.selectedTile) {
      tiles = tiles.delete(this.state.tiles.indexOf(this.state.selectedTile))
        .unshift(this.state.selectedTile);
    }

    return (
      <section className="welcome" style={{background: blueGrey50}}>
        <div className="welcome__content" ref={(ref) => this.contentRef = ref}>
          {tiles.map((tile) => this.renderTile(tile))}
        </div>
      </section>
    );
  }

  onTileClicked(selectedTile) {
    this.setState({selectedTile});
  }
}

import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styles from './tree-node-renderer.scss';

class MinimalThemeTreeNodeRenderer extends Component {
  constructor (props) {
    super(props);

    this.state = {};
    
    this.bound = {
      handleMouseOver: this.handleMouseOver.bind(this),
      handleMouseLeave: this.handleMouseLeave.bind(this)
    }
  }

  handleMouseOver () {
    if (!this.state.highlight) {
      this.setState({highlight: true})
    }
  }

  handleMouseLeave () {
    this.setState({highlight: false})
  }

  render() {
    const {
      children,
      swapFrom,
      swapLength,
      swapDepth,
      connectDropTarget,
      isOver,
      draggedNode,
      canDrop,
      treeIndex,
      treeId,
      listIndex,
      rowDirection,
      getPrevRow, // Delete from otherProps
      node, // Delete from otherProps
      path, // Delete from otherProps
      scaffoldBlockPxWidth,
      lowerSiblingCounts,
      ...otherProps
    } = this.props;
  
    // Construct the scaffold representing the structure of the tree
    let dropType;
    if (canDrop && !isOver) {
      dropType = 'validDrop'
    } else if (!canDrop && isOver) {
      dropType = 'invalidDrop'
    }
  
    return connectDropTarget(
      <div
           {...otherProps}
           onMouseOver={this.bound.handleMouseOver}
           onMouseLeave={this.bound.handleMouseLeave}
           onFocus={ () => {} }
           className={styles.node + (this.state.highlight ? ` ${styles.highlight}` : '') + (dropType ? ` ${styles[dropType]}` : '')}
      >
        <div
          className={styles.nodeContent}
        >
          {Children.map(children, child =>
            cloneElement(child, {
              isOver,
              lowerSiblingCounts,
              canDrop,
              draggedNode,
            })
          )}
        </div>
      </div>
    );
  }
}

MinimalThemeTreeNodeRenderer.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null,
  rowDirection: 'ltr'
};

MinimalThemeTreeNodeRenderer.propTypes = {
  treeIndex: PropTypes.number.isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  scaffoldBlockPxWidth: PropTypes.arrayOf(PropTypes.array).isRequired,
  treeId: PropTypes.string.isRequired,
  listIndex: PropTypes.number.isRequired,
  rowDirection: PropTypes.string,
  children: PropTypes.node.isRequired,

  // Drop target
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),

  // used in dndManager
  getPrevRow: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired
};

export default MinimalThemeTreeNodeRenderer;

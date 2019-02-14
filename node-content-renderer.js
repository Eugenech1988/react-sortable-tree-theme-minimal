import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./node-content-renderer.scss";

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== "function" &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  );
}

// eslint-disable-next-line react/prefer-stateless-function
class MinimalThemeNodeContentRenderer extends Component {
  render() {
    const {
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      title,
      subtitle,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      icons,
      buttons,
      className,
      style,
      didDrop,
      swapFrom,
      swapLength,
      swapDepth,
      treeId, // Not needed, but preserved for other renderers
      isOver, // Not needed, but preserved for other renderers
      parentNode, // Needed for dndManager
      rowDirection,
      scaffoldBlockPxWidth,
      lowerSiblingCounts,
      ...otherProps
    } = this.props;
    const nodeTitle = title || node.title;
    const nodeSubtitle = subtitle || node.subtitle;
    const isChild = parentNode !== null;
    
    const scaffoldBlockCount = lowerSiblingCounts.length - 1;
    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;
    
    const nodeContent = connectDragPreview(<div
        className={
          styles.rowContents +
          (isLandingPadActive ? ' draggingNode' : "") +
          (isSearchMatch ? ` ${styles.rowSearchMatch}` : "") +
          (isSearchFocus ? ` ${styles.rowSearchFocus}` : "") +
          (!canDrag ? ` ${styles.rowContentsDragDisabled}` : "")
        }
      >
        <div className={`${styles.rowWrapper} rowWrapperHolder`}>
            <span className='dataTreeLabel label-dragHolder'>
              <span>..</span>
              <span>..</span>
              <span>..</span>
            </span>
          <span className='dataTreeLabel label-checkbox'>
              <input type='checkbox' className='data-tree__checkbox'/>
            </span>
        </div>
        {toggleChildrenVisibility &&
         node.children &&
         (node.children.length > 0 || typeof node.children === "function") && (
           <div className='rstsw__btnWrapper'
                style={{paddingLeft: scaffoldBlockPxWidth * scaffoldBlockCount}}
           >
             <button
               type="button"
               aria-label={node.expanded ? "Collapse" : "Expand"}
               className={
                 node.expanded ? styles.collapseButton : styles.expandButton
               }
               onClick={() =>
                 toggleChildrenVisibility({
                   node,
                   path,
                   treeIndex
                 })
               }
             />
             {node.expanded &&
              !isDragging && (
                <div
                  style={{ width: scaffoldBlockPxWidth }}
                  className={styles.lineChildren}
                />
              )}
           </div>
         )}
        <div className={styles.rowLabel}
             style={{paddingLeft: 30 + (scaffoldBlockPxWidth * scaffoldBlockCount)}}
        >
          <span
            className={
              styles.rowTitle +
              (node.subtitle ? ` ${styles.rowTitleWithSubtitle}` : "")
            }
          >
            {typeof nodeTitle === "function"
              ? nodeTitle({
                node,
                path,
                treeIndex
              })
              : nodeTitle}
          </span>
          <span className={styles.rowType}>
            { node.type }
          </span>
          
          {nodeSubtitle && (
            <span className={styles.rowSubtitle}>
              {typeof nodeSubtitle === "function"
                ? nodeSubtitle({
                  node,
                  path,
                  treeIndex
                })
                : nodeSubtitle}
            </span>
          )}
        </div>
        
        <div className={styles.rowToolbar}>
          {buttons.map((btn, index) => (
            <div
              key={index} // eslint-disable-line react/no-array-index-key
              className={styles.toolbarButton}
            >
              {btn}
            </div>
          ))}
        </div>
      </div>
    );
    
    return (
      <div className={
              styles.mainRowToolbar +
              (isChild ? " mainRowToolbarChild" : "")
      } {...otherProps}
      >
        <div
          className={
            styles.rowWrapper +
            (!canDrag ? ` ${styles.rowWrapperDragDisabled} rowWrapperAll` : " rowWrapperAll")
          }
        >
          <div
            className={
              styles.row +
              (isLandingPadActive ? ` ${styles.rowLandingPad}` : "") +
              (isLandingPadActive && !canDrop ? ` ${styles.rowCancelPad}` : "") +
              (className ? ` ${className}` : "")
            }
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              ...style
            }}
          >
            {canDrag
              ? connectDragSource(nodeContent, { dropEffect: "copy" })
              : nodeContent}
          </div>
        </div>
      </div>
    );
  }
}

MinimalThemeNodeContentRenderer.defaultProps = {
  buttons: [],
  canDrag: false,
  canDrop: false,
  className: "",
  draggedNode: null,
  icons: [],
  isSearchFocus: false,
  isSearchMatch: false,
  parentNode: null,
  style: {},
  subtitle: null,
  swapDepth: null,
  swapFrom: null,
  swapLength: null,
  title: null,
  toggleChildrenVisibility: null,
  rowDirection: "ltr"
};

MinimalThemeNodeContentRenderer.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  canDrag: PropTypes.bool,
  className: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.node),
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  scaffoldBlockPxWidth: PropTypes.arrayOf(PropTypes.array).isRequired,
  style: PropTypes.shape({}),
  subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  swapDepth: PropTypes.number,
  swapFrom: PropTypes.number,
  swapLength: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  toggleChildrenVisibility: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,
  
  // Drag and drop API functions
  // Drag source
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  isDragging: PropTypes.bool.isRequired,
  parentNode: PropTypes.shape({}), // Needed for dndManager
  // Drop target
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
  rowDirection: PropTypes.string
};

export default MinimalThemeNodeContentRenderer;

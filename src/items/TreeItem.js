import React from 'react';
import {List, Ref} from 'semantic-ui-react';
import Item, {connectItem} from './Item';
import {treeItemFactory} from '.';
import md_strip_tags from 'remove-markdown';
import classnames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd'
import {findDOMNode} from 'react-dom';
import {canContain} from '../defaults';
import memoize from 'memoizee';

const MAX_LENGTH = 55;

const formatLabel = memoize((label, type) => {
  if (!label) {
     return label;
  }
  const text = type === 'note' ? md_strip_tags(label) : label;
  return text.length > MAX_LENGTH ? text.substring(0, MAX_LENGTH) + '\u2026': text;
});

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
      parent: props.parent,
      isPage: props.isPage,
      itemType: props.itemType
    }
  }
};

const itemTarget = {

  drop(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const dragParent = monitor.getItem().parent;
    const hoverIndex = props.index;
    const hoverParent = props.parent;
    if (dragIndex === hoverIndex
        && dragParent.get('id') === hoverParent.get('id')
    ) {
      return;
    }
    if (monitor.didDrop()) {
      return;
    }

    if (canContain(props.parent.get('type'), monitor.getItem().itemType)) {
      // Dropping aside
      const boundingRect = findDOMNode(component).getBoundingClientRect();
      const midY = (boundingRect.bottom - boundingRect.top) / 2;
      const y = monitor.getClientOffset().y - boundingRect.top;
      const targetIndex = y >= midY ? hoverIndex + 1 : hoverIndex;
      props.moveItem(dragIndex, targetIndex, dragParent.get('id'), hoverParent.get('id'), monitor.getItem().id);
    } else if (canContain(props.item.get('type'), monitor.getItem().itemType)) {
      // Dropping into
      props.moveItem(dragIndex, 0, dragParent.get('id'), props.item.get('id'), monitor.getItem().id);
    }
  }
};

class TreeItem extends Item {

  constructor(props) {
    super(props);
    this.node = null;
  }

  createChildren(props, config) {
    return this.props.item.get('items') && this.props.item.get('items')
      .map(itemId => this.props.getItemById(itemId))
      .map((item, index) => treeItemFactory(item, Object.assign(props, {index}), config));
  }

  getSubList() {
    const parent = this.props.item;
    const children = this.createChildren({pageId: this.props.pageId, parent, moveItem: this.props.moveItem, isPage: false, getItemById: this.props.getItemById}, this.props.itemEditors);
    if (children && children.size > 0) {
      return (
        <List.List>
          {children}
        </List.List>
      )
    }
    return null;
  }

  getLabel() {
    const text= formatLabel(this.props.item.getIn(['label', this.props.language]), this.props.item.get('type'));
    return !text ? <em>{this.props.itemId}</em> : text;
  }

  render() {
    const {connectDragSource, connectDropTarget, isOver, clientOffset, treeCollapsed} = this.props;
    let dragClass = null;
    if (isOver) {
      const boundingRect = this.node.getBoundingClientRect();
      const midY = (boundingRect.bottom - boundingRect.top) / 2;
      const y = this.props.clientOffset.y - boundingRect.top;
      if (y < midY) {
        dragClass = 'composer-drag-above';
      }
      if (y >= midY) {
        dragClass = 'composer-drag-below';
      }
    }
    return (
      <Ref innerRef={node => {connectDropTarget(node); connectDragSource(node); this.node = node;}}>
        <List.Item className={dragClass}>
          {
            this.props.treeCollapsible &&
              <List.Icon name={treeCollapsed ? 'caret right' : 'caret down'} style={{float: 'initial'}} onClick={() => this.setTreeCollapsed(!treeCollapsed)}/>
          }
          <List.Icon name={this.props.icon} style={{float: 'initial'}}/>
          <List.Content>
            <List.Header className={classnames({'composer-active': this.props.active})}>{this.getLabel()}</List.Header>
            {!treeCollapsed && this.getSubList()}
          </List.Content>
        </List.Item>
      </Ref>
    );
  }
}

const TreeItemConnected =
  connectItem(DragSource('item', itemSource, (connect, monitor) =>
    ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging
    }))
    (DropTarget('item', itemTarget, (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver({shallow: true}),
      clientOffset: monitor.getClientOffset()
    }))(TreeItem)));

export {
  TreeItem,
  TreeItemConnected as default
};

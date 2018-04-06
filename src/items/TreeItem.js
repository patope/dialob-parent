import React, {Component} from 'react';
import {List} from 'semantic-ui-react';
import Item, {connectItem} from './Item';
import {treeItemFactory} from '.';
import md_strip_tags from 'remove-markdown';
import classnames from 'classnames';

const MAX_LENGTH = 55;

class TreeItem extends Item {

  createChildren(props, config) {
    return this.props.item.get('items')
      .map(itemId => this.props.items.get(itemId))
      .map(item => treeItemFactory(item, props, config));
  }

  getSubList() {
    const children = this.createChildren();
    if (children && children.size > 0) {
      return (
        <List.List>
          {children}
        </List.List>
      )
    }
    return null;
  }

  preprocessLabel(label) {
    if (this.props.item.get('type') === 'note') {
      return label && md_strip_tags(label);
    } else {
      return label;
    }
  }

  formatLabel(label) {
    if (!label || !label.trim()) {
      return '-';
    } else if (label.length > MAX_LENGTH) {
      return label.substring(0, MAX_LENGTH) + '\u2026';
    } else {
      return label;
    }
  }

  render() {
    return (
      <List.Item >
        <List.Icon name={this.props.icon} style={{float: 'initial'}}/>
        <List.Content>
          <List.Header className={classnames({'composer-active': this.props.active})}>{this.formatLabel(this.preprocessLabel(this.props.item.getIn(['label', 'en'])))}</List.Header>
          {this.getSubList()}
        </List.Content>
      </List.Item>);
  }
}

const TreeItemConnected = connectItem(TreeItem);

export {
  TreeItem,
  TreeItemConnected as default
};

import React, {Component} from 'react';
import {itemFactory} from '.';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {setActiveItem, addItem, changeItemType, updateItem, deleteItem, showChangeId, setActivePage} from '../actions';
import * as Defaults from '../defaults';

class Item extends Component {

  createChildren(props, config) {
    return this.props.item.get('items') && this.props.item.get('items')
      .map(itemId => this.props.items.get(itemId))
      .map(item => itemFactory(item, props, config));
  }
}

function connectItem(component) {
  return connect(
    (state, props) => ({
      items: state.form && state.form.get('data'),
      active: props.item && state.editor && props.item.get('id') === state.editor.get('activeItemId'),
      language: (state.editor && state.editor.get('activeLanguage')) || Defaults.FALLBACK_LANGUAGE,
      get findRootItem() { return () => findRoot(this.items); },
    }),
    (dispatch, props) => ({
      setActive: () => dispatch(setActiveItem(props.item.get('id'))),
      newItem: (config, parentItemId, afterItemId) => dispatch(addItem(config, parentItemId, afterItemId)),
      setType: (config) => dispatch(changeItemType(config, props.item.get('id'))),
      setAttribute: (attribute, value, language = null) => dispatch(updateItem(props.item.get('id'), attribute, value, language)),
      delete: () => dispatch(deleteItem(props.item.get('id'))),
      changeId: () => dispatch(showChangeId(props.item.get('id'))),
      setActivePage: (pageId) => dispatch(setActivePage(pageId))
    })
  )(component);
}

export {
  Item as default,
  connectItem
};
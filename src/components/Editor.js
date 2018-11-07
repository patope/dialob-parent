import React, {Component} from 'react';
import {Segment, Menu, Icon, Input, Button, Popup, Dropdown, Loader, Label} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {findRoot} from '../helpers/utils';
import {setActivePage, addItem, deleteItem, loadForm, showItemOptions, showChangeId} from '../actions';
import {itemFactory} from '../items';
import * as Defaults from '../defaults';
import ItemTypeMenu from './ItemTypeMenu';
import { ItemMenu } from './ItemMenu';

const PageMenu = ({onDelete, onOptions, onChangeId}) => (
  <Dropdown icon='content' style={{marginLeft: '0.5em'}}>
    <Dropdown.Menu>
      <Dropdown.Item icon='options' text='Options...' onClick={onOptions}/>
      <Dropdown.Item icon='key' text='Change ID...' onClick={onChangeId} />
      <Dropdown.Item  icon='remove' text='Delete' onClick={onDelete} />
    </Dropdown.Menu>
  </Dropdown>
);

class Editor extends Component {

  createChildren(activePage, props, config) {
    return activePage && activePage.get('items') && activePage.get('items')
      .map(itemId => this.props.items.get(itemId))
      .map(item => itemFactory(item, props, config));
  }

  newItem(config, activePageId) {
    this.props.addItem(config, activePageId);
  }

  /*
  componentDidMount() {
    const rootItem = this.props.findRootItem();
    if (!rootItem) {
      this.props.loadForm(this.props.config.get('formId'));
    }
  }
  */

  render() {
    const rootItem = this.props.findRootItem();
    if (!rootItem) {
      return null;
    }
    /*
    if (!rootItem) {
      return <Segment basic padded><Loader active /></Segment>;
    }
    */
    const activePageId = this.props.activePageId ? this.props.activePageId: rootItem.getIn(['items', 0]);
    const activePage = this.props.items.get(activePageId);
    const pages = rootItem && rootItem.get('items') ? rootItem.get('items')
                        .map(itemId => this.props.items.get(itemId))
                        .map((item, index) =>
                            <Menu.Item onClick={() => this.props.setActivePage(item.get('id'))} key={index} active={item.get('id') === activePageId}>{item.getIn(['label', 'en']) || <em>{item.get('id')}</em>}
                               <PageMenu onDelete={() => this.props.deleteItem(item.get('id'))}
                                         onOptions={() => this.props.showItemOptions(item.get('id'), true)}
                                         onChangeId={() => this.props.showChangeId(item.get('id'))}
                                 />
                            </Menu.Item>) : null;
    return (
      <Segment basic>
        <Menu tabular>
          {pages}
          <Menu.Menu position='right'>
            <Menu.Item>
              { (!pages || pages.size === 0) && <Label pointing='right' size='large' color='blue'>No pages yet, click here to add one</Label> }
              <Button icon='add' onClick={() => this.newItem(Defaults.PAGE_CONFIG, rootItem.get('id'))} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        {this.createChildren(activePage, {parentItemId: activePageId}, this.props.itemEditors)}
        {
          activePage &&
            <Dropdown button text='Add item'>
              <Dropdown.Menu>
                <ItemTypeMenu categoryFilter={(category => category.type === 'structure')} onSelect={(config) => this.newItem(config, activePageId)}/>
              </Dropdown.Menu>
            </Dropdown>
        }
      </Segment>
    );
  }
}

const EditorConnected = connect(
  state => ({
    config: state.dialobComposer.config,
    items: state.dialobComposer.form && state.dialobComposer.form.get('data'),
    activePageId: state.dialobComposer.editor && state.dialobComposer.editor.get('activePageId'),
    itemEditors:  state.dialobComposer.config && state.dialobComposer.config.itemEditors,
    get findRootItem() { return () => findRoot(this.items); }
  }),
  {
    setActivePage,
    addItem,
    deleteItem,
    loadForm,
    showItemOptions,
    showChangeId
  }
)(Editor);

export {
  EditorConnected as default,
  Editor
};

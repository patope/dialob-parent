import React, {Component} from 'react';
import {Modal, Button, Tab, Segment, Input, Grid, Statistic, Menu} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {hideValueSets, createValueset, setGlobalValuesetName} from '../actions';
import ValueSetEditor from './ValueSetEditor';

const VSEdit = ({valueSetId, label, onChangeName, items}) => {
  const users = items.entrySeq().reduce((r, v) => v[1].get('valueSetId') === valueSetId ? r = r + 1 : r, 0);
  return (
    <Segment>
      <Grid columns={2}  verticalAlign='middle'>
          <Grid.Column width={12}>
            <Input fluid value={label || ''} placeholder = 'List name' onChange={(evt) => onChangeName(valueSetId, evt.target.value)} />
          </Grid.Column>
          <Grid.Column width={4} >
            <Statistic horizontal size='mini' label='Users' value={users} />
          </Grid.Column>
      </Grid>
      <ValueSetEditor valueSetId={valueSetId} />
    </Segment>
  );
};

class ValueSetDialog extends Component {

  getValueSetErrorStyle(valueSetId) {
    const valueSetErrors = this.props.errors &&
      this.props.errors
        .filter(e => e.get('message').startsWith('VALUESET_') && e.get('itemId') === valueSetId);
    if (!valueSetErrors || valueSetErrors.size === 0) {
      return null;
    } else  if (valueSetErrors.size === valueSetErrors.filter(e => e.get('level') === 'WARNING').size) {
      return 'composer-warning';
    } else {
      return 'composer-error';
    }
  }

  render() {
    if (this.props.valueSetsOpen) {

      const panes = this.props.globalValueSets ? this.props.globalValueSets.map((gvs, key) =>
       ({
         menuItem: (
          <Menu.Item key={key} className={this.getValueSetErrorStyle(gvs.get('valueSetId'))} >
            {gvs.get('label') || 'untitled' + key}
          </Menu.Item>
         ),
         render: () => <VSEdit key={key} valueSetId={gvs.get('valueSetId')} label={gvs.get('label')} onChangeName={this.props.setGlobalValuesetName} items={this.props.items} />})).toJS()
        : [];

      return (
        <Modal open size='large'>
          <Modal.Header>
            Global Lists
            <Button floated='right' onClick={() => this.props.createValueset()}>Add new list</Button>
          </Modal.Header>
          <Modal.Content scrolling>
            {
              panes.length > 0 &&
              <Tab menu={{fluid: true, vertical: true, pointing: true}} menuPosition='left' panes={panes} />
            }
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => this.props.hideValueSets()}>OK</Button>
          </Modal.Actions>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

const ValueSetDialogConnected = connect(
  state => ({
    valueSetsOpen: state.dialobComposer.editor && state.dialobComposer.editor.get('valueSetsOpen'),
    globalValueSets: state.dialobComposer.form && state.dialobComposer.form.getIn(['metadata', 'composer', 'globalValueSets']),
    items: state.dialobComposer.form && state.dialobComposer.form.get('data'),
    errors: state.dialobComposer.editor && state.dialobComposer.editor.get('errors')
  }), {
    hideValueSets,
    createValueset,
    setGlobalValuesetName
  }
)(ValueSetDialog);

export {
  ValueSetDialogConnected as default,
  ValueSetDialog
};

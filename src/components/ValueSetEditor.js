import React, {Component} from 'react';
import {Table, Button, Input, Message, Ref} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {findValueset} from '../helpers/utils';
import {createValueset, createValuesetEntry, updateValuesetEntry, deleteValuesetEntry, moveValuesetEntry} from '../actions';
import * as Defaults from '../defaults';
import { translateErrorMessage } from '../helpers/utils';
import { DragSource, DropTarget } from 'react-dnd'
import {findDOMNode} from 'react-dom';

const DropPosition = {
  ABOVE: 0,
  BELOW: 1
};

const getDropPosition = (boundingRect, clientOffset) => {
  const midY = (boundingRect.bottom - boundingRect.top) / 2;
  const y = clientOffset.y - boundingRect.top;
  if (y >= midY) {
    return DropPosition.BELOW;
  } else {
    return DropPosition.ABOVE;
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

const rowTarget = {
  drop(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) { return; }
    if (monitor.didDrop()) { return; }
    const dropPosition = getDropPosition(findDOMNode(component).getBoundingClientRect(), monitor.getClientOffset());

    const targetIndex = dropPosition === DropPosition.BELOW ? hoverIndex + 1 : hoverIndex;

    if (dragIndex === targetIndex) { return; }
    props.moveEntry(dragIndex, targetIndex);
  }
}

class EntryRow extends Component {

  constructor(props) {
    super(props);
    this.node = null;
  }

  render() {
    const {entry, index, valueSetErrors, deleteValuesetEntry, updateValuesetEntry, valueSetId, language, isOver, connectDragSource, connectDropTarget, clientOffset} = this.props;
    const entryErrors = valueSetErrors && valueSetErrors.find(e => e.get('index') === index || e.get('expression') === entry.get('id'));
    let dragClass = null;
    if (isOver) {
      const dropPosition = getDropPosition(this.node.getBoundingClientRect(), clientOffset);
      dragClass = dropPosition === DropPosition.ABOVE ? 'composer-drag-above' : 'composer-drag-below';
    }
    return (
      <Ref innerRef={node => {connectDropTarget(node); connectDragSource(node); this.node = node;}}>
        <Table.Row key={index} error={entryErrors ? true : false} className={dragClass}>
          <Table.Cell collapsing>
            <Button size='tiny' icon='remove' onClick={() => deleteValuesetEntry(valueSetId, index)} />
          </Table.Cell>
          <Table.Cell>
              <Input transparent fluid value={entry.get('id') || ''} onChange={(e) => updateValuesetEntry(valueSetId, index, e.target.value, null, null)} />
          </Table.Cell>
          <Table.Cell>
              <Input transparent fluid value={entry.getIn(['label', language]) || ''} onChange={(e) => updateValuesetEntry(valueSetId, index, null, e.target.value, language)}/>
          </Table.Cell>
        </Table.Row>
      </Ref>);
  }
};

const DraggableEntryRow =
  DragSource('vsrow', rowSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(DropTarget('vsrow', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({shallow: true}),
  clientOffset: monitor.getClientOffset()
}))(EntryRow))

class ValueSetEditor extends Component {

  constructor(props) {
    super(props);
    this.moveEntry = this.moveVSEntry.bind(this);
  }

  moveVSEntry(from, to) {
    this.props.moveValuesetEntry(this.props.valueSetId, from, to);
  }

  render() {
      const {deleteValuesetEntry, updateValuesetEntry, valueSetId, language} = this.props;
      const dedupe = (item, idx, arr) => arr.indexOf(item) === idx;

      const valueSetErrors = this.props.errors &&
          this.props.errors
            .filter(e => e.get('message').startsWith('VALUESET_') && e.get('itemId') === valueSetId)
      const errors = valueSetErrors && valueSetErrors.groupBy(e => e.get('level'));

      const errorList = errors && errors.get('ERROR') &&
                <Message attached={errors.get('WARNING') ? true : 'bottom'} error header='Errors'
                    list={errors.get('ERROR').map(e => translateErrorMessage(e)).toJS().filter(dedupe)} />;

      const warningList = errors && errors.get('WARNING') &&
                <Message attached='bottom' warning header='Warnings'
                    list={errors.get('WARNING').map(e => translateErrorMessage(e)).toJS().filter(dedupe)} />;

      const rows = this.props.getValueset().get('entries')
        ? this.props.getValueset().get('entries').map((e, i) =>
           <DraggableEntryRow key={i} entry={e} moveEntry={this.moveEntry} index={i} valueSetErrors={valueSetErrors}
              deleteValuesetEntry={deleteValuesetEntry} updateValuesetEntry={updateValuesetEntry} valueSetId={valueSetId} language={language} />)
        : [];

      return (
      <React.Fragment>
        <Table celled attached={errorList || warningList ? 'top' : null}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing><Button size='tiny' icon='add' onClick={() => this.props.createValuesetEntry(this.props.getValueset().get('id'))} /></Table.HeaderCell>
              <Table.HeaderCell>Key</Table.HeaderCell>
              <Table.HeaderCell>Text</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
        {errorList}
        {warningList}
      </React.Fragment>
      );
  }
}

const ValueSetEditorConnected = connect(
  (state, props) => ({
    language: (state.dialobComposer.editor && state.dialobComposer.editor.get('activeLanguage')) || Defaults.FALLBACK_LANGUAGE,
    get getValueset() { return () => findValueset(state.dialobComposer.form, props.valueSetId); },
    errors: state.dialobComposer.editor && state.dialobComposer.editor.get('errors')
  }), {
    createValueset,
    createValuesetEntry,
    updateValuesetEntry,
    deleteValuesetEntry,
    moveValuesetEntry
  }
)(ValueSetEditor);

export {
  ValueSetEditorConnected as default,
  ValueSetEditor
};

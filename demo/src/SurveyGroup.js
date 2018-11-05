import React, {Component} from 'react';
import {Table, Input, Dropdown, Button} from 'semantic-ui-react';
import {Item, ItemMenu, connectItem} from '../../src';
import {connect} from 'react-redux';

class SurveyGroup extends Item {
  render() {
    const valueSet = this.props.getValueset(this.props.item.get('valueSetId'));
    const entries = valueSet && valueSet.get('entries') && valueSet.get('entries').map((e, i) =>
      <Table.Row key={i}>
        <Table.Cell>{e.get('id')}</Table.Cell>
        <Table.Cell>{e.getIn(['label', this.props.language])}</Table.Cell>
        <Table.Cell>
          <Button size='tiny' icon='remove' />
        </Table.Cell>
      </Table.Row>
    );
    return (
      <React.Fragment>
        <Table onClick={(e) => {e.stopPropagation(); this.props.setActive();}}  attached='top' color={this.props.active ? 'blue' : null}>
          <Table.Body>
            <Table.Row>
              <Table.Cell selectable collapsing width={2} >
                <a onClick={() => this.props.changeId()}>{this.props.item.get('id')}</a>
              </Table.Cell>
              <Table.Cell>
                <Input transparent fluid placeholder={this.props.placeholder} value={this.props.item.getIn(['label', this.props.language]) || ''} onChange={(e) => this.props.setAttribute('label', e.target.value, this.props.language)}/>
              </Table.Cell>
              <Table.Cell collapsing>
                <ItemMenu item={this.props.item} parentItemId={this.props.parentItemId} onDelete={this.props.delete}/>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Table attached='bottom'>
          <Table.Body>
            {entries}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell>
                <Button size='tiny' icon='add' />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </React.Fragment>
    );
  }
}

const SurveyGroupConnected = connectItem(SurveyGroup);

export {
  SurveyGroupConnected as default
};

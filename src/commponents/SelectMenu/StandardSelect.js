import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select,Button } from '../common';
/* eslint-disable */
class StandardSelect extends Component {

  render() {
    const { items, item, icon, handleChange } = this.props;
    return (
        <Select
            items={items}
            item={item}
            handleChange={handleChange}
        >
            <Button className="bp3-button" text={item.name}></Button>
        </Select>
    );
  }
}

StandardSelect.propTypes = {
  item: PropTypes.object,
  items: PropTypes.array,
  handleChange: PropTypes.func,
};

export default StandardSelect;

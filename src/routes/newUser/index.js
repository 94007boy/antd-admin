/**
 * Created by root on 17-6-23.
 */

import React from 'react'
import {connect} from 'dva'
import {Tabs} from 'antd'
import {routerRedux} from 'dva/router'
import PropTypes from 'prop-types'
import List from './newUser'
import Filter from './Filter'

const Index = ({newUser, dispatch, location, loading}) => {
  const {listFiltered, pagination, sortedInfo, filter} = newUser;
  let {selectedRowKeys} =newUser;
  const hasSelected = selectedRowKeys.length > 0;

  const listProps = {
    scroll: true,
    pagination,
    dataSource: listFiltered,
    loading: loading.effects['newUser/query'],
    sortedInfo,
    selectedRowKeys,
  }

  const refresh =() =>{
    dispatch({
      type: 'newUser/query', payload: {}
    })
    selectedRowKeys = [];
  }

  const filterProps = {
    loading: loading.effects['newUser/query'],
    filter: filter,
    hasSelected,
    selectedRowKeys,
    onFilterChange (value) {
      dispatch(
        {type: 'newUser/filter', payload: {filter:value.text}}
      )
    },
    refresh
  }

  return (<div className="content-inner">
    <Filter {...filterProps} />
    <List {...listProps}/>
  </div>)
};

Index.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({newUser, loading}) => ({newUser, loading}))(Index)
import React from 'react'
import PropTypes from 'prop-types'
import {Table,message} from 'antd'
import './DataTable.less';
import lodash from 'lodash';
import {fetch} from "../../services/restfulService";
import {delay, sortJsonArr} from "../../utils/dataUtils";
import Filter from "./Filter";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      current: 1,
      dataSourceBack: [],
      pageSize: 5,
    }
  }

  componentDidMount() {

    this.getTableData();
  }

  getTableData = () => {
    const {fetchData} = this.props;
    this.setState({loading: true});
    fetch(fetchData)
      .then((result) => {
        this.setState({
          dataSource: result.data,
          dataSourceBack: lodash.cloneDeep(result.data),
          loading: false
        });
      })
  };

  handleTableChange = (pagination, filters, sorter) => {
    delay.call(this).then(() => {
      if (sorter.order) {
        let orderType = sorter.order === 'descend' ? 'desc' : 'asc';
        sortJsonArr(this.state.dataSource, sorter.field, orderType);
      }
      this.setState({current: pagination.current, pageSize: pagination.pageSize})
    })
  };

  filterProps = {
    onFilterChange: ({name: keyword}) => {
      delay.call(this).then(() => {
        let result = [];
        let list = lodash.cloneDeep(this.state.dataSourceBack);
        if (keyword) {
          if (list && list.length > 0) {
            result = list.filter((row) => {
              return Object.values(row).filter(item => item && String(item).toLowerCase().indexOf(keyword.toLowerCase()) > -1).length > 0
            });
          }
        } else {
          result = this.state.dataSourceBack;
        }
        this.setState({dataSource: result})
      })
    }
  };

  checkRefresh = () => {
    let refresh = this.state.refresh;
    if (!refresh) {
      this.setState({refresh: this.props.refresh})
    } else {
      if (this.props.refresh !== refresh) {
        this.setState({refresh: this.props.refresh});
        this.getTableData()
      }
    }
  };

  render() {

    this.checkRefresh();

    const tableProps = {
      columns: this.props.columns,
      ...this.state
    };
    let pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      total: null,
      pageSize: this.state.pageSize,
      defaultPageSize: 5,
      pageSizeOptions: ['5', '20', '30', '40'],
      current: this.state.current
    };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.props.handleSelectItems(selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
      }),
    };

    return (
      <div>
        <Filter {...this.filterProps} />
        <Table
          ref="DataTable"
          rowSelection={rowSelection}
          bordered
          onChange={this.handleTableChange}
          {...tableProps}
          pagination={pagination}
        />
      </div>
    )
  }
}


DataTable.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  fetchData:PropTypes.object
};

export default DataTable

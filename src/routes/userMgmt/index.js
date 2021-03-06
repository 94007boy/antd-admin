/**
 * Created by chenkang1 on 2017/8/30.
 */
import React from "react";
import PropTypes from "prop-types";
import {connect} from "dva";
import {Select, Row, Col, Card, Button, Input, Icon} from "antd";
import DataTable from "../../components/BasicTable/DataTable";
import DropOption from "../../components/DropOption/DropOption";
import {fetchAndNotification} from "../../services/restfulService";
import ModalForm from "../../components/modalForm/ModalForm";
import LifeCycle from "./lifeCycle";

class UserMgmt extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userUpdateModalvisible: false,
      userUpdateFetchData: null,
      addUserModal: null,
      updateUserModal: null
    };
  }

  componentWillMount() {

    this.lifeCycle = {
      test: this.state.test
    };

    this.setState({
      addUserModal: {
        id: '',
        refresh: this.refresh,
        btnText: 'Add user',
        btnTextShow: true,
        formItems: {
          user_name: {
            name: 'user_name',
            key: 'user_name',
            // initialValue: 1,
            rules: [
              {
                required: true, message: 'Please input your username!'
              },
            ],
            render: function () {
              return (<Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>)
            }
          },
          user_pwd: {
            name: 'user_pwd',
            key: 'user_pwd',
            rules: [
              {required: true, message: 'Please input your password!'},
              {
                validator: function checkConfirmPassword(rule, value, callback) {
                  // console.log(this)
                  const form = this.props.form;
                  const pwd = form.getFieldValue('user_pwd_twice');
                  if (value && pwd && value !== pwd) {
                    callback('Two passwords that you enter is inconsistent!');
                  } else {
                    callback();
                  }
                }
              }
            ],
            render: function () {
              return (
                <Input type="password" prefix={<Icon type="lock" style={{fontSize: 13}}/>} placeholder="new password"/>)
            }
          },
          user_pwd_twice: {
            name: 'user_pwd_twice',
            key: 'user_pwd_twice',
            rules: [
              {required: true, message: 'Please input your password!'},
              {
                validator: function checkConfirmPassword(rule, value, callback) {
                  const form = this.props.form;
                  const pwd = form.getFieldValue('user_pwd');
                  if (value && pwd && value !== pwd) {
                    callback('Two passwords that you enter is inconsistent!');
                  } else {
                    callback();
                  }
                }
              }
            ],
            render: function () {
              return (<Input type="password" prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                             placeholder="confirm password"/>)
            }
          },
          type: {
            "name": "type",
            "key": "type",
            rules: [{required: true, message: 'Please select your gender!'}],
            render: function () {
              return (
                <Select
                  showSearch
                  style={{width: 200}}
                  placeholder="Select user type"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="10">admin</Option>
                  <Option value="0">ordinary</Option>
                </Select>
              )
            }
          }
        },
        submit: {
          btnText: 'create',
          // should use function instead of es6 =>{} ,make sure get modalForm's current this
          handleSubmit: function (values) {
            fetchAndNotification({
              url: 'user/user',
              method: 'post',
              params: values,
              notifications: {
                title: 'create Action',
                success: `创建${values.user_name} 操作成功！`,
                error: `创建${values.user_name} 操作失败！`,
              },
            }).then((result) => {
              /*
               * when the fetch successfully ,refresh the table
               * current this is modalForm's runtime this
               */
              this.props.form.resetFields();
              this.props.refresh();
            })
          }
        },
        modalTitle: 'Add User',
        modalVisible: false,
        spinning: false,
        handleModalShow: () => {
          this.setState(prevState => {
            const addUserModal = prevState.addUserModal;
            addUserModal.modalVisible = true;
            return {
              addUserModal
            }
          })
        },
        handleModalHide: () => {
          this.setState(prevState => {
            const addUserModal = prevState.addUserModal;
            addUserModal.modalVisible = false;
            return {
              addUserModal
            }
          })
        }
      },

      updateUserModal: {
        id: '',
        refresh: this.refresh,
        btnTextShow: false,
        type: 'edit',
        formItems: {
          user_name: {
            name: 'user_name',
            key: 'user_name',
            rules: [
              {
                required: true, message: 'Please input your username!'
              },
            ],
            render: function () {
              return (<Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>)
            }
          },
          user_pwd: {
            name: 'user_pwd',
            key: 'user_pwd',
            updateValueFlag: false,
            rules: [
              {required: true, message: 'Please input your password!'},
              {
                validator: function checkConfirmPassword(rule, value, callback) {
                  // console.log(this)
                  const form = this.props.form;
                  const pwd = form.getFieldValue('user_pwd_twice');
                  if (value && pwd && value !== pwd) {
                    callback('Two passwords that you enter is inconsistent!');
                  } else {
                    callback();
                  }
                }
              }
            ],
            render: function () {
              return (
                <Input type="password" prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                       placeholder="new password"/>)
            }
          },
          user_pwd_twice: {
            name: 'user_pwd_twice',
            key: 'user_pwd_twice',
            updateValueFlag: false,
            rules: [
              {required: true, message: 'Please input your password!'},
              {
                validator: function checkConfirmPassword(rule, value, callback) {
                  const form = this.props.form;
                  const pwd = form.getFieldValue('user_pwd');
                  if (value && pwd && value !== pwd) {
                    callback('Two passwords that you enter is inconsistent!');
                  } else {
                    callback();
                  }
                }
              }
            ],
            render: function () {
              return (<Input type="password" prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                             placeholder="confirm password"/>)
            }
          },
          type: {
            "name": "type",
            "key": "type",
            rules: [{required: true, message: 'Please select your gender!'}],
            render: function () {
              return (
                <Select
                  showSearch
                  style={{width: 200}}
                  placeholder="Select user type"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="10">admin</Option>
                  <Option value="0">ordinary</Option>
                </Select>
              )
            }
          }
        },
        submit: {
          btnText: 'update',
          // should use function instead of es6 =>{} ,make sure get modalForm's current this
          handleSubmit: function (values) {
            fetchAndNotification({
              url: 'user/user',
              method: 'put',
              params: {
                ...values,
                id: this.props.id
              },
              notifications: {
                title: 'create Action',
                success: `创建${values.user_name} 操作成功！`,
                error: `创建${values.user_name} 操作失败！`,
              },
            }).then((result) => {
              /*
               * when the fetch successfully ,refresh the table
               * current this is modalForm's runtime this
               */
              this.props.form.resetFields();
              this.props.refresh();
            })
          }
        },
        modalTitle: 'Edit user',
        modalVisible: false,
        spinning: false,
        handleModalShow: () => {
          this.setState(prevState => {
            const updateUserModal = prevState.updateUserModal;
            updateUserModal.modalVisible = true;
            updateUserModal.spinning = true;
            return {
              updateUserModal
            }
          })
        },
        handleModalHide: () => {
          this.setState(prevState => {
            const updateUserModal = prevState.updateUserModal;
            updateUserModal.modalVisible = false;
            return {
              updateUserModal
            }
          })
        }
      }
    })
  }

  refresh = () => {
    this.props.dispatch({type: "userMgmt/refresh"});
  };

  /*
   * if the props will update in sometimes, should write in init or render method
   * if the props are constant, you can write it in componentWillMount
   */
  init = () => {
    this.tableDataProps = {
      columns: [
        {
          title: "username",
          dataIndex: "username",
          key: "username",
        },
        {
          title: "type",
          dataIndex: "type",
          key: "type",
        },
        {
          title: "time",
          dataIndex: "time",
          key: "time",
        },
        {
          title: "Operation",
          key: "operation",
          width: 100,
          render: (text, record) => {
            return (
              <DropOption
                onMenuClick={e => {
                  console.log()
                  this.tableDataProps.handleMenuClick(record, e)
                }}
                menuOptions={[
                  {key: "1", name: "Update"},
                  {key: "2", name: "Delete"}
                ]}
              />
            );
          }
        }
      ],
      fetchData: {
        url: "/user/users",
        params: null
      },
      errorMsg: "get user table error",
      refresh: this.props.modelProps.refresh,// basic model refresh count
      handleSelectItems: (selectedRowKeys, selectedItems) => {
        this.props.dispatch({
          type: "userMgmt/updateSelectItems",
          payload: {
            selectedRowKeys,
            selectedItems
          }
        });
      },
      handleMenuClick: (record, e) => {
        if (e.key === "1") {
          this.state.updateUserModal.handleModalShow();
          fetchAndNotification({
            url: `user/userId/${record.id}`,
            method: 'get',
            notifications: {
              title: 'create Action',
              error: `获取用户${record.username}信息失败！`,
            }
          })
            .then((result) => {
              if (result.data && result.data.type === "success") {
                this.setState(prevState => {
                  const updateUserModal = prevState.updateUserModal;
                  for (const key in result.data.items) {
                    if (key in updateUserModal.formItems) {
                      updateUserModal.formItems[key].updateValue = result.data.items[key];
                    }
                  }
                  prevState.updateUserModal.spinning = false;
                  prevState.updateUserModal.id = record.id;
                  return {
                    updateUserModal: prevState.updateUserModal
                  };
                })
              }
            })
        } else if (e.key === "2") {
          fetchAndNotification({
            url: `user/userId/${record.id}`,
            method: 'delete',
            notifications: {
              title: 'create Action',
              success: `删除${record.username} 操作成功！`,
              error: `删除${record.username} 操作失败！`,
            }
          })
            .then(() => {
              this.refresh()
            })
        }
      }
    };
  };

  render() {
    this.init();
    return (
      <div className="content-inner">
        <Row gutter={32}>
          <Col lg={24} md={24}>
            <Card title="用户管理">
              <div className="action-btn-container">
                <Button type="primary" onClick={this.refresh} icon="reload"/>
                {/*list a sort of actions*/}
                <ModalForm {...this.state.addUserModal}/>
                {/*{this.state.updateUserModal ? <ModalForm {...this.state.updateUserModal} /> : null}*/}
                <ModalForm {...this.state.updateUserModal}/>

                {/*<LifeCycle {...this.lifeCycle} fetchData={this.state.userUpdateFetchData}/>*/}
              </div>
              <DataTable {...this.tableDataProps} />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

UserMgmt.propTypes = {
  loading: PropTypes.object,
  modelProps: PropTypes.object
};

export default connect(({userMgmt, loading}) => ({modelProps: userMgmt, loading}))(UserMgmt)

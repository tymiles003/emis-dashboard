import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Input, Select, Button, DatePicker, Modal } from 'antd';
import { postAlert } from '../../../../actions';
import './styles.css';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

/**
 * Function that show a modal to
 * remind user to draw area involved in alert
 *
 * @class
 * @name error
 *
 * @version 0.1.0
 * @since 0.1.0
 */
function error() {
  Modal.error({
    title: 'Sorry you have not specified area involved in this Alert',
    content: (
      <div>
        <p>
          Inorder to Specify an area involved in this Alert kindly use the draw
          controls to Draw an area involved in this alert
        </p>
      </div>
    ),
    onOk() {},
  });
}

/**
 * New Alert Form
 *
 * @class
 * @name NewAlertForm
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class NewAlertForm extends React.Component {
  static propTypes = {
    createAlert: PropTypes.func,
    geometry: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.array,
    }),
  };

  static defaultProps = {
    geometry: {},
    createAlert: () => {},
  };

  handleSubmit = e => {
    const { geometry, form, createAlert, history } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          event,
          category,
          urgency,
          severity,
          certainty,
          instructions,
          headline,
          expectedAt,
          expiredAt,
        } = values;
        const payload = {
          category,
          headline,
          expectedAt: expectedAt.toISOString(),
          expiredAt: expiredAt.toISOString(),
          event,
          urgency,
          severity,
          certainty,
          instruction: instructions,
          geometry,
          source: 'testing',
          area: 'testing',
        };
        if (geometry) {
          createAlert(payload);
          history.push('/alerts');
        } else {
          error();
        }
      }
    });
  };

  renderSelectOptions = options =>
    options.map(option => (
      <Option key={option} value={option}>
        {option}
      </Option>
    ));

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const messageTypes = ['Alert', 'Update', 'Cancel', 'Error', 'Ask'];

    const categoryOptions = [
      'Geo',
      'Met',
      'Safety',
      'Security',
      'Rescue',
      'Fire',
      'Health',
      'Env',
      'Transport',
      'Infra',
      'CBRNE',
      'Other',
    ];

    const responseTypes = [
      'Shelter',
      'Evacuate',
      'Prepare',
      'Execute',
      'Avoid',
      'Monitor',
      'Assess',
      'AllClear',
      'None',
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div className="NewAlertForm">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Event">
            {getFieldDecorator('event', {
              rules: [
                {},
                {
                  required: true,
                  message: 'Please input Alert Event!',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Headline">
            {getFieldDecorator('headline', {
              rules: [
                {},
                {
                  required: true,
                  message: 'Please input Alert Headline!',
                },
              ],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Category">
            {getFieldDecorator('category', {
              rules: [
                {},
                {
                  required: true,
                  message: 'Please Category of an Alert!',
                },
              ],
            })(
              <Select showSearch>
                {this.renderSelectOptions(categoryOptions)}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Urgency">
            {getFieldDecorator('urgency', {
              rules: [
                {},
                {
                  required: true,
                  message: 'Please Urgency of an Alert!',
                },
              ],
            })(
              <Select showSearch>
                <Option value="Immediate">Immediate</Option>
                <Option value="Expected">Expected</Option>
                <Option value="Future">Future</Option>
                <Option value="Past">Past</Option>
                <Option value="Unknown">Unknown</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Severity">
            {getFieldDecorator('severity', {
              rules: [
                {},
                {
                  required: true,
                  message: 'Please Severity of an Alert!',
                },
              ],
            })(
              <Select showSearch>
                <Option value="Extreme">Extreme</Option>
                <Option value="Severe">Severe</Option>
                <Option value="Moderate">Moderate</Option>
                <Option value="Minor">Minor</Option>
                <Option value="Unknown">Unknown</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Certainty">
            {getFieldDecorator('certainty', {
              rules: [
                {},
                {
                  required: true,
                  message: 'Please Certainty of an Alert!',
                },
              ],
            })(
              <Select showSearch>
                <Option value="Observed">Observed</Option>
                <Option value="Likely">Likely</Option>
                <Option value="Possible">Possible</Option>
                <Option value="Unlikely">Unlikely</Option>
                <Option value="Unknown">Unknown</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Message Type">
            {getFieldDecorator('type', {
              rules: [
                {},
                {
                  required: true,
                  message: 'Please Message Type of an Alert!',
                },
              ],
            })(
              <Select showSearch>
                {this.renderSelectOptions(messageTypes)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Response Type">
            {getFieldDecorator('response', {
              rules: [
                {},
                {
                  required: true,
                  message: 'Please Response Type of an Alert!',
                },
              ],
            })(
              <Select showSearch>
                {this.renderSelectOptions(responseTypes)}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="OnSet">
            {getFieldDecorator('expectedAt', {
              rules: [
                {
                  required: true,
                  type: 'object',
                  message: 'Please input when Alert Onsets!',
                },
              ],
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Expires">
            {getFieldDecorator('expiredAt', {
              rules: [
                {
                  required: true,
                  type: 'object',
                  message: 'Please input when Alert Expires!',
                },
              ],
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Instructions">
            {getFieldDecorator('instructions', {
              rules: [
                {
                  required: true,
                  message: 'Please Write instructions for an Alert!',
                },
              ],
            })(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedNewAlertForm = Form.create()(NewAlertForm);
const mapStateToProps = state => ({
  geometry: state.alertsMap.drawnGeometry,
});

const mapDispatchToProps = {
  createAlert: postAlert,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(WrappedNewAlertForm));

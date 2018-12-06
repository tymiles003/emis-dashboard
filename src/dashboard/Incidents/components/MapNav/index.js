import React from 'react';
import PropTypes from 'prop-types';
import { Button, Menu } from 'antd';
import { connect } from 'react-redux';
import './styles.css';
import IncidentDetails from '../IncidentDetails';
import IncidentLegend from '../IncidentLegend';
import { getNavActive } from '../../actions';
import { bindActionCreators } from 'redux';

/**
 * Map Navigation  Layout component
 * this navigations layout will show
 * different Map actions
 *
 * @class
 * @name MapNav
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class MapNav extends React.Component {
  static propTypes = {
    newIncidentButton: PropTypes.func,
    currentMenu: PropTypes.string,
    selected: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        incidentsTypeData: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            nature: PropTypes.string.isRequired,
            family: PropTypes.string.isRequired,
            code: PropTypes.string.isRequired,
            cap: PropTypes.string.isRequired,
            color: PropTypes.string,
            _id: PropTypes.string,
          }).isRequired
        ),
        description: PropTypes.string.isRequired,
        startAt: PropTypes.date,
        endAt: PropTypes.date,
      }).isRequired
    ),
    activatedNav: PropTypes.func,
  };

  static defaultProps = {
    newIncidentButton: null,
    currentMenu: '',
    selected: null,
    activatedNav: null,
  };

  constructor() {
    super();
    this.state = {
      hideNav: false,
    };
  }

  handleClick = (data) => {
    const {activatedNav} = this.props;
    activatedNav(data.key) ;
  }

  render() {
    const { newIncidentButton, currentMenu ,selectNav} = this.props;
    const { hideNav } = this.state;

   const showNavContent = currentMenu => {
      const {selected} = this.props;
      switch (currentMenu) {
        case 'legend': {
          return <IncidentLegend />;
        }
        case 'details': {
          return <IncidentDetails incident={selected}/>;
        }
        default:
          return false;
      }
    }

    return !hideNav ?(
      <div>
        <div className="MapNav">
          <Button type="primary" onClick={newIncidentButton}>
            + New Incident
          </Button>
        </div>
        <div className="topNav">
          <Menu
            onClick={this.handleClick}
            selectedKeys={[currentMenu]}
            mode="horizontal"
          >
            <Menu.Item key="legend">Legend</Menu.Item>
            {selectNav ? <Menu.Item key="details">Details</Menu.Item> : null}
          </Menu>
          <div>{showNavContent(currentMenu)}</div>
        </div>
      </div>
    ) : null;
  }
}
const mapStateToProps = state => ({
  selected: state.selectedIncident.incident
    ? state.selectedIncident.incident
    : [],
    currentMenu: state.activeNav && state.activeNav.activeItem,
  selectNav: state.selectedIncident.incident
  ? state.selectedIncident.incident
  : null,
});

const mapDispachToProps = dispatch => ({
  activatedNav : bindActionCreators(getNavActive, dispatch)

})

export default connect(
  mapStateToProps,
  mapDispachToProps
)(MapNav);

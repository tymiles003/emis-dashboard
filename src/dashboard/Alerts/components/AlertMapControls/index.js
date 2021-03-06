import React from 'react';
import { connect } from 'react-redux';
import { withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { saveDrawnGeometry } from '../../actions';
import DrawControls from '../../../../common/components/DrawControls';

// this constant contains the contents that will be
// displayed inside leaflet  popup
const popupContent = `<div>
<div class="ant-modal-body">
    <h2>To create new Alert, Draw the area that is involved  in the Alert using the Draw Controls and Fill the Form</h2>
</div>
<div class="ant-modal-footer">
    <div>
        <button type="button" id="info-button" class="ant-btn ant-btn-primary"><span>OK</span></button>
    </div>
</div>
</div>`;

/**
 *  Draw Control for Drawing Alert shapes
 * @class
 * @name AlertMapControls
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AlertMapControls extends React.Component {
  static propTypes = {
    saveGeometry: PropTypes.func,
    leaflet: PropTypes.shape({
      map: PropTypes.object.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    saveGeometry: () => {},
  };

  constructor(props) {
    super(props);
    this.onDrawCreated = this.onDrawCreated.bind(this);
  }

  componentDidMount() {
    this.map = this.props.leaflet.map;
    this.showTutorial();
  }

  showTutorial = () => {
    L.popup({ minWidth: 450 })
      .setLatLng([-6.179, 35.754])
      .setContent(popupContent)
      .openOn(this.map);
    document.querySelector('#info-button').addEventListener('click', e => {
      e.preventDefault();
      this.map.closePopup();
    });
  };

  onDrawCreated = ({ geometry }) => {
    const { saveGeometry } = this.props;
    saveGeometry(geometry);
  };

  render() {
    return <DrawControls onDrawCreated={this.onDrawCreated} />;
  }
}

const mapDispatchToProps = dispatch => ({
  saveGeometry(geometry) {
    dispatch(saveDrawnGeometry(geometry));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(withLeaflet(AlertMapControls));

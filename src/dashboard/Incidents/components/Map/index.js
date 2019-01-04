import React from 'react';
import { get } from 'lodash';
import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import 'leaflet-draw';
import IncidentForm from '../IncidentForm';
import MapNav from '../MapNav';
import {
  getIncidentsSuccess,
  getSelectedIncident,
  getIncidentActions,
  activeIncidentAction,
} from '../../actions';
import { showMarkers, baseMaps } from '../../../../common/lib/mapUtil';

import './styles.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Spin } from 'antd';

const { Map: LeafletMap, TileLayer, Popup } = ReactLeaflet;

/**
 * IncidentMap component
 * this component will show incident contents
 * on Openstreet map
 *
 * @class
 * @name IncidentMap
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class IncidentMap extends React.Component {
  static propTypes = {
    incidents: PropTypes.arrayOf(
      PropTypes.shape({
        event: PropTypes.string,
        incidentsTypeData: PropTypes.shape({
          name: PropTypes.string,
          nature: PropTypes.string.isRequired,
          family: PropTypes.string.isRequired,
          color: PropTypes.string,
          _id: PropTypes.string,
        }),
        description: PropTypes.string.isRequired,
        startedAt: PropTypes.string,
        endedAt: PropTypes.string,
        _id: PropTypes.string,
      }).isRequired
    ),
    selected: PropTypes.shape({
      event: PropTypes.string,
      incidentsTypeData: PropTypes.shape({
        name: PropTypes.string,
        nature: PropTypes.string.isRequired,
        family: PropTypes.string.isRequired,
        color: PropTypes.string,
        _id: PropTypes.string,
      }),
      description: PropTypes.string.isRequired,
      startedAt: PropTypes.string,
      endedAt: PropTypes.string,
    }).isRequired,
    incidentsAction: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string.isRequired,
        phase: PropTypes.string.isRequired,
        incident: PropTypes.shape({
          event: PropTypes.string.isRequired,
          startedAt: PropTypes.string,
          endedAt: PropTypes.string,
          _id: PropTypes.string,
        }),
        incidentType: PropTypes.shape({
          name: PropTypes.string,
          nature: PropTypes.string.isRequired,
          family: PropTypes.string.isRequired,
          color: PropTypes.string,
          _id: PropTypes.string,
        }),
        _id: PropTypes.string,
      })
    ).isRequired,
    handleIncidentActions: PropTypes.func,
    handleIncidents: PropTypes.func,
    getIncident: PropTypes.func,
    setIncidentAction: PropTypes.func,
  };

  static defaultProps = {
    incidents: null,
    handleIncidents: null,
    getIncident: null,
    handleIncidentActions: null,
    setIncidentAction: null,
  };

  constructor() {
    super();
    this.state = {
      position: [-6.8161, 39.2804],
      zoom: 7,
      showPopup: false,
      hideButton: false,
      area: {},
    };
    this.mapRef = React.createRef();
    this.onclickNewIncidentButton = this.onclickNewIncidentButton.bind(this);
    this.onCancelButton = this.onCancel.bind(this);
    this.onSelectIncident = this.showSelectedIncident.bind(this);
  }

  componentDidMount() {
    this.map = this.mapRef.current.leafletElement;
    this.mapLayers();
    this.DisplayMarkers();
    const { handleIncidents, handleIncidentActions } = this.props;
    handleIncidents();
    handleIncidentActions();
  }

  componentDidUpdate(prevProps) {
    const { incidents, selected } = this.props;
    if (incidents !== prevProps.incidents) {
      this.incidentLayer.clearLayers();
      this.showAllIncidents(incidents);
    }
    if (selected && selected !== prevProps.selected) {
      this.showSelectedIncident(selected);
    } else if (selected !== prevProps.selected) {
      this.map.removeLayer(this.selectedLayer);
    }
  }

  mapLayers = () => {
    L.control.layers(baseMaps, {}, { position: 'bottomleft' }).addTo(this.map);
  };

  DisplayMarkers = () => {
    this.incidentLayer = L.geoJSON([], {
      pointToLayer: showMarkers,
      onEachFeature: this.onEachFeature,
    }).addTo(this.map);
  };

  showAllIncidents = incidents => {
    incidents.map(({ epicentre }) => this.incidentLayer.addData(epicentre));
    this.map.setView([-6.179, 35.754], 7);
    this.incidentLayer.addTo(this.map);
  };

  onEachFeature = (feature, layer) => {
    const { properties } = feature;
    const { event } = properties;
    layer
      .on('click', this.onClickIncident)
      .bindTooltip(`${event}`)
      .openTooltip();
  };

  onEachFeaturePoint = () => {
    this.incidentLayer.clearLayers();
  };

  showPoint = areaSelected => {
    L.geoJSON(areaSelected, {
      pointToLayer: showMarkers,
      onEachFeature: this.onEachFeaturePoint,
    }).addTo(this.map);
  };

  showSelectedIncident = incidentSelected => {
    const { areaSelected } = incidentSelected;
    this.selectedLayer = this.showPoint(areaSelected);
  };

  initDrawControls = () => {
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);
    this.drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        circlemarker: false,
        rectangle: false,
        marker: true,
      },
      edit: {
        featureGroup: this.drawnItems,
      },
    });
    this.map.addControl(this.drawControl);
  };

  showDrawnItems = e => {
    const { layer } = e;
    this.drawnItems.addLayer(layer);
    const type = get(layer.toGeoJSON(), 'geometry.type');
    this.setState({
      position:
        type === 'Point' ? layer.getLatLng() : layer.getBounds().getCenter(),
      area: layer.toGeoJSON(),
      showPopup: true,
    });
  };

  contentPopup = () => {
    const { position } = this.state;
    const contents = `<div>
      <div class="ant-modal-body">
        <h3>To create new incident, draw or put marker to the specific area involved</h3>
      </div>
      <div class="ant-modal-footer">
        <div>
        </div>
      </div>
    </div> `;

    this.popup = L.popup({ minWidth: 350 })
      .setLatLng(position)
      .setContent(contents)
      .openOn(this.map);
    this.setState({ hideButton: true });
  };

  onclickNewIncidentButton = () => {
    this.contentPopup();
    this.initDrawControls();
    this.map.on('draw:created', e => this.showDrawnItems(e));
    this.map.removeLayer(this.incidentLayer);
  };

  onCancel = () => {
    this.map.removeControl(this.drawControl);
    this.map.removeLayer(this.drawnItems);
    this.setState({ hideButton: false });
    this.map.closePopup();
  };

  onCloseIncidentDetail = () => {
    this.map.addLayer(this.incidentLayer);
  };

  getSpinValue = () => {
    const { loading } = this.props;
    let spin = false;
    if (loading) {
      spin = loading;
    } 
    return spin;
  };

  onClickIncident = e => {
    const { getIncident, incidentsAction, setIncidentAction } = this.props;
    const id = get(e, 'target.feature.properties._id');
    incidentsAction.filter(incidentAction => {
      const { incident } = incidentAction;
      const { _id: incidentId } = incident;
      if (incidentId === id) {
        const { _id: actionId } = incidentAction;
        return setIncidentAction(actionId);
      }
      return null;
    });

    getIncident(id);
    this.map.removeLayer(this.incidentLayer);
  };

  render() {
    const { position, zoom, showPopup, hideButton, area } = this.state;
    const { incidents } = this.props;
    let spin = this.getSpinValue();
    return (
      <div>
        <Spin spinning={spin} tip="Loading..."
        size="large"
        style={{ position: 'absolute', top: '25%', right: '5%' }}>
        {!hideButton ? (
          <MapNav
            newIncidentButton={this.onclickNewIncidentButton}
            clickedIncident={this.onSelectIncident}
          />
        ) : null}
        <LeafletMap center={position} zoom={zoom} ref={this.mapRef}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            id="mapbox.light"
            url="https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoid29ybGRiYW5rLWVkdWNhdGlvbiIsImEiOiJIZ2VvODFjIn0.TDw5VdwGavwEsch53sAVxA#1.6/23.725906/-39.714135/0"
          />
          {showPopup ? (
            <Popup position={position} minWidth={450}>
              <IncidentForm
                onCancelButton={this.onCancel}
                location={area}
                incidentsTypeData={incidents}
              />
            </Popup>
          ) : null}
        </LeafletMap>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  incidents:
    state.incidents.data && state.incidents.data ? state.incidents.data : [],
  selected: state.incidents.incident ? state.incidents.incident : [],
  incidentsAction: state.incidents.incidentActionsData
    ? state.incidents.incidentActionsData
    : [],
  loading : state.incidents.isLoading,
});

const mapDispatchToProps = dispatch => ({
  handleIncidents: bindActionCreators(getIncidentsSuccess, dispatch),
  getIncident: bindActionCreators(getSelectedIncident, dispatch),
  handleIncidentActions: bindActionCreators(getIncidentActions, dispatch),
  setIncidentAction: bindActionCreators(activeIncidentAction, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IncidentMap);

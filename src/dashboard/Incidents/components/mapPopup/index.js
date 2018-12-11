import './style.css';

export default function popupContent(props) {
  const { name, incidentType, description, startedAt, _id } = props;
  const contentPopup = `<div class="popupContent">
          <div id="iw-container">'
            <div class="iw-title" style={{background:incidentType.color}}>${name}</div>
            <div class="iw-content">
              <table >
                <tbody>
                  <tr><td>Incident</td><td id="popupData">${name}</td></tr>
                  <tr><td>Type</td><td id="popupData">${
                    incidentType.name
                  }</td></tr>
                  <tr><td>Time of Call</td><td id="popupData">${startedAt}</td></tr>
                  <tr><td>Description</td><td id="popupData"> ${description}</td></tr>
                </tbody></table>
                <br/><button id='more_details' type="button" class="ant-btn ant-btn-primary" data =${_id}>Click for more</button> 
            </div>
        </div>
      </div>`;
  // if (props !== null) {
  //   document
  //     .querySelector('#more_details')
  //     .addEventListener('click', test, false);
  // } else {
  //   console.log('we have null value');
  // }

  // function test() {
  //   console.log('esesesee');
  // }

  return contentPopup;
}

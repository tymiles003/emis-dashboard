import React from 'react';
import { Row, Col, Divider } from 'antd';


class SytemDetail extends React.Component {
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }

    render() {
        const { title, name,  } = this.props;
        return (
            <div>
                {title}
                <Row >
                    <Col span="24" >
                        {name.map(({ name, type, message}) => <div className="p-10"
                        style={{
                            color: '#909090'
                        }}
                        >
                            <h4 style={{
                                color: '#909090'
                            }}
                            >{name}</h4>
                            <p className="p-l-10"> {type}</p>
                            <p className="p-l-10"> {message}</p>

                        </div>
                        )}

                    </Col>
                </Row>

            </div>

        );
    }
}

const SidebarSettings = ({ title }) => {
    const data = {
        systemSetting: [
            { name: 'Incident', type: 'Type',message:""},
            { name: 'Alert', type: 'Category', message:"Message type" },
            { name: 'Warning', type: 'Type',message:"" },
        ],
        generalSetting: [
            { name: 'User' },
            { name: 'Roles' },
            { name: 'COnfiguration/' },
            { name: 'Preference' },
            { name: 'Predefine' },

        ],

    };

    return (
        <div>
            <Row>
                <Col span={24} className="p-20">
                    <div style={{ marginBottom: "15px" }}>
                        <SytemDetail className="p-a-md" 
                        title={title} name={data.systemSetting} 
                        type={data.systemSetting} message={data.systemSetting}/>
                    </div>
                    <Divider />
                    <SytemDetail title="General" name={data.generalSetting} />

                </Col>
            </Row>
        </div>
    )


}

export default SidebarSettings;
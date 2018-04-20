import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { populate } from './user-data';
import { fetchNewName, fetchNewTime } from './actions';

class NewTest extends React.Component {
    state: {
        value: string;
    }
    props: {
        postName:(string) => string; 
        postTime: (string) => string; 
        userData: {
            alarms:[{
                title:string;
                time:string;
                user_uuid:string;
                state:string;
                repeat:string;
                alarm_uuid:string;
            }],
            profile: {
                name:string;
                email:string;
                phone:string;
                permission:string;
            }
        }
    }


    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.postTime({
            alarm_uuid: this.props.userData.alarms[0].alarm_uuid,
            time: this.state.value
        })
        
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' className = 'big-form-item' value = {this.state.value} onChange = {this.handleChange} />
                    <input type="submit" value="Submit" className = 'button dark-button' />
                </form>
                
                <h1>profile</h1>
                <p>{this.props.userData.profile.name}</p>
                <p>{this.props.userData.profile.email}</p>
                <p>{this.props.userData.profile.phone}</p>
                <p>{this.props.userData.profile.permission}</p>
                <h1>alarms</h1>
                <h4>{this.props.userData.alarms[0].title}</h4>
                <p>{this.props.userData.alarms[0].time}</p>
                <p>{this.props.userData.alarms[0].user_uuid}</p>
                <p>{this.props.userData.alarms[0].state}</p>
                <p>{this.props.userData.alarms[0].repeat}</p>
            </div>
        )
    }    
}

const mapStateToProps = state => {
    return {
        userData: state.userData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        postName:(v) => dispatch(fetchNewName(v)),
        postTime:(v) => dispatch(fetchNewTime(v))
    }
}

const TestApp = connect(
    mapStateToProps, 
    mapDispatchToProps
)(NewTest)




export { TestApp };
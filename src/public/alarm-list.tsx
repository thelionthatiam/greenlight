import * as React from 'react';
import Toggler from './little-components/toggle'
import { connect, Provider } from 'react-redux';
import { fetchNewTime } from './actions';

export class AlarmList extends React.Component {
    props: {
        alarms:any;
        postTime:any;
        postTitle:any;
        toggleActive:any;
    }

    constructor(props) {
        super(props)

    }

    render() {
        let alarms = this.props.alarms.map((alarm) => {
            return <Alarm 
                    alarm = {alarm}
                    key={alarm.id}
                    postTime = {this.props.postTime}
                    toggleActive = {this.props.toggleActive}
                    postTitle = {this.props.postTitle}
                />
        })



        return (
            <div>
                {alarms} 
            </div>
        )
    }
}


class Alarm extends React.Component {
    props: {
        alarm:any;
        postTime:any;
        postTitle:any;
        toggleActive:any;
    }

    constructor(props) {
        super(props)
        this.testClick = this.testClick.bind(this)
    }

    testClick() {
        console.log('test click completed', this.props.alarm.alarm_uuid)
    }

    render() {
        let activeButton;
        if (this.props.alarm.active) {
            activeButton = <button type='submit' className="button dark-button">disable</button>
        } else {
            activeButton = <button type='submit' className="button light-button">enable</button>
        }
        
        return (
            <div className="column contentWrapper">
                <div className="alarm-row">
                    <div className = 'time-wrapper'>
                        <div className='form-row'>
                            <TitleForm
                                alarm_uuid = {this.props.alarm.alarm_uuid}
                                title = {this.props.alarm.title}
                                postTitle = {this.props.postTitle}
                                />
                        </div>
                        {/* <form className='form-row' action={"/app/accounts/" + this.props.alarm.user_uuid + "/alarms/" + this.props.alarm.alarm_uuid + "/title"} method='get'>
                            <input type='submit' className = "alarm-title small-text link-text" value={this.props.alarm.title}/>
                            <p className="small-text centered-text">•</p>
                            <p className = "small-text centered-text">{this.props.alarm.nextAlarm}</p>
                            <input name="alarm_uuid" type="hidden" value= {this.props.alarm.alarm_uuid}/>
                            <input name="title" type='hidden' value={this.props.alarm.title}/>
                        </form>*/}
                        <div className='alarm-time-row'>
                            <TimeForm
                                alarm_uuid = {this.props.alarm.alarm_uuid}
                                time = {this.props.alarm.time}
                                postTime = {this.props.postTime}
                            />
                            <div className = 'toggle-down'>
                                <Toggler alarm = {this.props.alarm} toggleActive = {this.props.toggleActive}/>
                                {/* <img className = 'icon down-arrow' src = '/icons/black/forward-outline.svg'/> */}
                            </div>

                        </div>
                    </div>
                </div>
                    
                <div className="alarm-row">
                    <a href='/app/accounts/{user_uuid}/settings'>
                        <img className='icon fadeIn' src='/icons/black/gear.svg'/>
                    </a>
                    <form action="/app/accounts/{user_uuid}/alarms/{alarm_uuid}?_method=DELETE" method="POST">
                        <input className = "icon" type="image" width="20px" height="20px" src="/icons/black/trash.svg"/>
                        <input name="alarm_uuid" type="hidden" value={this.props.alarm.alarm_uuid}/>
                    </form>
                </div>
            </div>
        )
    }
}



class TimeForm extends React.Component {
    state: {
        value: string;
        form: boolean;
    }
    props: {
        postTime: any;
        alarm_uuid:string;
        time:string;
    }
    alarm_uuid: string;
    wrapperRef: Node;

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.time,
            form: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {document.addEventListener('mousedown', this.handleClickOutside)}
    componentWillUnmount() {document.removeEventListener('mousedown', this.handleClickOutside)}

    onBlur() {
        this.setState({
            form:!this.state.form,
            value:this.props.time
        })
    }

    setWrapperRef(node) { this.wrapperRef = node }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.handleSubmit(event)
            this.onBlur()
        }
    }

    handleChange(event) {
        if (event.target.value !== '') {
            this.setState({ value: event.target.value });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.value !== '') {
            this.props.postTime({
                alarm_uuid: this.props.alarm_uuid,
                time: this.state.value
            }) // is this the only difference?    
        }        
    }

    render() {
        return (
            <div>
                {!this.state.form 
                ? 
                <div onClick={this.onBlur}><p className = 'alarm-time link-text'>{this.props.time}</p></div> 
                :  
                <form  ref = {this.setWrapperRef} onSubmit = {this.handleSubmit} onBlur = {this.onBlur}>
                    <input type='text' className='link-text-form alarm-time' value = {this.state.value} onChange={this.handleChange} />
                </form>}
            </div>
        )
    }
}


class TitleForm extends React.Component {
    state: {
        value: string;
        form: boolean;
    }
    props: {
        postTitle: any; // changed
        alarm_uuid: string;
        title: string; // changed
    }
    alarm_uuid: string;
    wrapperRef: Node;

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.title, // changed
            form: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() { document.addEventListener('mousedown', this.handleClickOutside) }
    componentWillUnmount() { document.removeEventListener('mousedown', this.handleClickOutside) }

    onBlur() {
        this.setState({
            form: !this.state.form,
            value: this.props.title // changed
        })
    }

    setWrapperRef(node) { this.wrapperRef = node }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.handleSubmit(event)
            this.onBlur()
        }
    }

    handleChange(event) {
        if (event.target.value !== '') {
            this.setState({ value: event.target.value });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.value !== '') {
            this.props.postTitle({ // this changed
                alarm_uuid: this.props.alarm_uuid,
                title: this.state.value
            }) // is this the only difference?    
        }
    }

    render() {
        return (
            <div>
                {!this.state.form
                    ?
                    <div onClick={this.onBlur}><p className='alarm-title small-text link-text'>{this.props.title}</p></div> //changed class and property
                    :
                    <form ref={this.setWrapperRef} onSubmit={this.handleSubmit} onBlur={this.onBlur}>
                        <input type='text' className='link-text-form alarm-title small-text' value={this.state.value} onChange={this.handleChange} />
                    </form>}
            </div>
        )
    }
}

 
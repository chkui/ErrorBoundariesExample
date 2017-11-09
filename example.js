import React from 'react'
import {render, createPortal} from 'react-dom'
import './example.css'

class Parent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {myError: false, childError: false, catchError: false}
        this.clickHandle = this.clickHandle.bind(this)
        this.childErrorClickHandle = this.childErrorClickHandle.bind(this)
    }

    clickHandle() {
        try {
            throw new Error('event error')
        } catch (e) {
            this.setState({myError: true})
        }
    }

    childErrorClickHandle(){
        this.setState({childError:true})
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.myError) {
            throw new Error('Error')
        }
    }

    componentDidCatch(error, info) {
        console.log('Error:',  error)
        console.log('Error info:', info)
        this.setState({catchError: true})
    }

    render() {
        return (
            <div className="box">
                <p>Parent</p>
                <button className="button" onClick={this.clickHandle}>throw parent error</button>
                <button className="button" onClick={this.childErrorClickHandle}>throw child error</button>
                {
                    this.state.catchError ? (<ErrorTip/>):(<Child error={this.state.childError}/>)
                }

            </div>
        )
    }
}

class Child extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.error){throw new Error('child error')}
    }

    render(){
        return (<div className="box">
            <p>Child</p>
        </div>)
    }
}

const ErrorTip = props =>
    <div className="box"><p>组件坏掉了，赶紧去找小伙伴解决吧。</p></div>

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {error: false}
    }

    componentDidCatch(error, info) {
        console.log('Error:',  error)
        console.log('Error info:', info)
        this.setState({error: true})
    }

    render() {
        return (
            <div className="app">
                <h2>Example</h2>
                {this.state.error ? (<ErrorTip />) : (<Parent/>)}
            </div>
        )
    }
}

render(<App/>, document.getElementById('root'))
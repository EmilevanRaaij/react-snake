import React, {Component, createRef} from "react";
import './index.css';
import Snake from './Snake';
import apple from './apple.png';
import head from './face.png';

class App extends Component<{},{score:number}>{
    constructor(props:any){
        super(props);
        this.state = {
            score: 0
        }
    }

    Scorechanged = (s:number) => {
        this.setState({
            score: s
        });
    }

    render(){
        return(
            <div className='snakewrapper'>
                <Snake
                scorechange={this.Scorechanged}
                startinglength={3}
                snakecolor={'#345ed1'}
                headcolor={'#345ed1'}
                pixels={12} 
                appleimg={apple} 
                backgroundcolor={'#279e03'}
                headimg={head}
                speed={150}
                />
                <h1>{this.state.score}</h1>
            </div>
        );
    }
}

export default App;
import React, {Component} from "react";
import './Snake.css';

class Node extends Component<{
    index:any, 
    state:number, 
    direction:number, 
    length:number, 
    appleimg:any, 
    headimg:any, 
    pixels:number,
    snakecolor:any,
    headcolor:any
    },{}>{
    constructor(props:any){
        super(props)
    }
    render(){
        if(this.props.state === 0){//normal node
            return(
                <div className="node">
                </div>
            );
        }else if(this.props.state === this.props.pixels*this.props.pixels+1){//apple node
            return(
                <div className="node apple">
                    <img src={this.props.appleimg}/>
                </div>
            );
        }else if(this.props.state === this.props.length){//head node
            if(this.props.direction === 1){//going right
                return(
                    <div style={{backgroundColor: this.props.headcolor}} className="node head right">
                        <img src={this.props.headimg}/>
                    </div>
                );
            }else if(this.props.direction === -1){//going left
                return(
                    <div style={{backgroundColor: this.props.headcolor}} className="node head left">
                        <img src={this.props.headimg}/>
                    </div>
                );
            }else if(this.props.direction === this.props.pixels){//going down
                return(
                    <div style={{backgroundColor: this.props.headcolor}} className="node head down">
                        <img src={this.props.headimg}/>
                    </div>
                );
            }else if(this.props.direction === -this.props.pixels){//going up
                return(
                    <div style={{backgroundColor: this.props.headcolor}} className="node head up">
                        <img src={this.props.headimg}/>
                    </div>
                );
            }
        }else if(this.props.state >= 1){//snake node
            return(
                <div style={{backgroundColor: this.props.snakecolor}} className="node snake">
                </div>
            );
        }
    }
}

interface Requiredprops{
    pixels:number, 
    appleimg:any, 
    speed:number,
    snakecolor:any,
    headcolor:any,
    scorechange: any,
    startinglength: number
}

interface Optionalprops{
    backgroundcolor?:any,
    backgroundimg?:any,
    headimg?:any, 
}

interface Totalprops extends Requiredprops, Optionalprops{};

class Snake extends Component<Totalprops,{
    nodestates:number[], 
    running:boolean, 
    direction:number, 
    length:number, 
    headlocation:number
    }>{
    interval:any;
    static defaultProps = {
        backgroundcolor: '#00000000'
    };
    constructor(props:any){
        super(props);
        this.state = {
            nodestates: [],
            running: false,
            direction: 1, // 1: right, -1: left, pixels: down, -pixels: up
            length: this.props.startinglength, 
            headlocation: Math.round((this.props.pixels/2)*this.props.pixels+1)
        }
        for(let i:number = 0; i<this.props.pixels*this.props.pixels; i++){
            this.state.nodestates.push(0);
        }
    }

    loop = () => {
        let nodestates = this.state.nodestates;
        
        let oldheadlocation = this.state.headlocation;
        let newheadlocation = oldheadlocation + this.state.direction;

        if(nodestates[newheadlocation] == this.props.pixels*this.props.pixels+1){//new head location on apple
            let leng = this.state.length;
            this.setState({length:leng+1}, () => {
                this.props.scorechange(this.state.length - this.props.startinglength);
                this.nextLoop(nodestates, newheadlocation);
                this.generateApple();
            });
        }else if(newheadlocation >= this.props.pixels*this.props.pixels){//out of bounds going down
            this.setState({running:false});
        }else if(newheadlocation < 0){//out of bounds going up
            this.setState({running:false});
        }else if(this.state.direction == 1 && newheadlocation % this.props.pixels == 0){//out of bounds to the right
            this.setState({running:false});
        }else if(this.state.direction == -1 && (newheadlocation+1) % this.props.pixels == 0){//out of bounds to the left
            this.setState({running:false});
        }else if(nodestates[newheadlocation] > 0){//new head location on snake
            this.setState({running:false});
        }else{
            this.nextLoop(nodestates, newheadlocation);
        }   
    }

    nextLoop = (nodestates:number[], newheadlocation:number) => {
        if(this.state.running == true){
            let nst = nodestates;
            let nhl = newheadlocation;
            //decrease lifetime of snake nodes
            for(let index in nst){
                if(nst[index] >= 1 && nst[index] < this.props.pixels*this.props.pixels+1){
                    nst[index] = nst[index] -1;
                }
            }
            nst[nhl] = this.state.length;//make head on new head location
            this.setState({nodestates: nst, headlocation: nhl}, () => {
                setTimeout(this.loop, this.props.speed);
            });
        }   
    }

    componentDidMount(){
        this.setNodeActive(this.state.headlocation, this.state.nodestates);
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        this.setState({running: false});
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }

    handleKeyDown = (e:any) => {
        if(e.keyCode === 13 && this.state.running == false){//enter
            this.setState({running:true}, () => {
                this.startGame();
            });
        }
        if(e.keyCode === 37 && this.state.direction != 1){//arrow left
            this.setState({direction:-1});
        }
        if(e.keyCode === 38 && this.state.direction != this.props.pixels){//arrow up
            this.setState({direction:-this.props.pixels});
        }
        if(e.keyCode === 39 && this.state.direction != -1){//arrow right
            this.setState({direction:1});
        }
        if(e.keyCode === 40 && this.state.direction != -this.props.pixels){//arrow down
            this.setState({direction:this.props.pixels});
        }
    }

    randomNumberInRange(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

    setNodeActive(index:number, arr:any){
        arr[index] = this.state.length;
        this.setState({nodestates: arr});
    }

    generateApple(){
        let arr = this.state.nodestates;
        let randomindex = this.randomNumberInRange(0, (this.props.pixels*this.props.pixels-1));
        if(this.state.nodestates[randomindex] > 0 && this.state.nodestates[randomindex] < this.props.pixels*this.props.pixels+1){
            this.generateApple();
        }else{
            arr[randomindex] = this.props.pixels*this.props.pixels+1;
            this.setState({nodestates: arr});
        }
    }

    startGame(){  
        this.setState({
            nodestates: [],
            running: true,
            direction: 1, // 1: right, -1: left, pixels: down, -pixels: up
            length: this.props.startinglength, 
            headlocation: Math.round((this.props.pixels/2)*this.props.pixels+1)
        }, () => {
            let n = [];
            for(let i:number = 0; i<this.props.pixels*this.props.pixels; i++){
                n.push(0);
            }
            this.setState({nodestates: n}, () => {
                this.setNodeActive(this.state.headlocation, this.state.nodestates);
                this.generateApple();
                this.props.scorechange(0);
                this.loop();
            });
        });
    }
    
    render(){
        if(this.props.backgroundcolor == undefined){
            return(
                <div style={{gridTemplateColumns: "repeat("+this.props.pixels+", 1fr)", gridTemplateRows: "repeat("+this.props.pixels+", 1fr)", backgroundImage: `url(` + this.props.backgroundimg + `)`}} className="game">
                    {this.state.nodestates.map((e:any, i:any) => {
                        return(
                            <Node 
                                pixels={this.props.pixels} 
                                appleimg={this.props.appleimg} 
                                headimg={this.props.headimg}
                                length={this.state.length} 
                                snakecolor={this.props.snakecolor}
                                headcolor={this.props.headcolor}
                                direction={this.state.direction} 
                                state={this.state.nodestates[i]} 
                                key={i} 
                                index={i}
                            />
                        );
                    })}
                </div>
            );
        }else{
            return(
                <div style={{gridTemplateColumns: "repeat("+this.props.pixels+", 1fr)", gridTemplateRows: "repeat("+this.props.pixels+", 1fr)", backgroundColor: this.props.backgroundcolor}} className="game">
                    {this.state.nodestates.map((e:any, i:any) => {
                        return(
                            <Node 
                                pixels={this.props.pixels} 
                                appleimg={this.props.appleimg} 
                                headimg={this.props.headimg}
                                length={this.state.length} 
                                snakecolor={this.props.snakecolor}
                                headcolor={this.props.headcolor}
                                direction={this.state.direction} 
                                state={this.state.nodestates[i]} 
                                key={i} 
                                index={i}
                            />
                        );
                    })}
                </div>
            );
        }
    }
}
export default Snake;
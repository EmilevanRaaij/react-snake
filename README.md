# Snake in React with images

## Available Scripts

In the project directory, you can run:

### `npm start`

### `npm test`

### `npm run build`

### `npm run eject`

# The Snake component

## props

### pixels

Required: Yes

Type: Integer

The height and width of the game

### speed

Required: Yes 

Type: Integer

The amount of millisconds between frames; less time means a faster snake

### startinglength

Required: Yes

Type: Integer

The length of the snake when the game begins

### appleimg

Required: Yes 

Type: Image

The image to be displayed as apple

### headimg

Required: No

Type: Image

The image for the head of the snake

### backgroundimage

Required: No

Type: Image

The background image for the game

### backgroundcolor

Required: No

Type: String

The background color for the game overrides [backgroundimage]

### snakecolor

Required: Yes

Type: String

The color for the body of the snake

### headcolor

Required: Yes

Type: String

The color for the head of the snake

### scorechange

Required: No

Type: Function

Callback function when the score changes, gives a score

#### example:
```
callback(score:any){
    console.log(score)
}

<Snake scorechange={callback}/>
```
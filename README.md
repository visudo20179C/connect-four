# Connect Four with VueJS

[![Total alerts](https://img.shields.io/lgtm/alerts/g/visudo20179C/connect-four.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/visudo20179C/connect-four/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/visudo20179C/connect-four.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/visudo20179C/connect-four/context:javascript)

## Have you ever played connect four?

It's a pretty fun game. Connect four spaces horizontally, vertically, or diagonally to win.

This implementation was ~500 SLOC and was written in the VueJS framework. For styling, I'm using TailwindCSS.

- [VueJS](https://vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/) 

This is a personal project of mine however I'm open to contributions/feedback.  

There is a live version of the site running [here](https://connect-four.visudo.me/) if you'd like to see how it works.

## socket-io

This project is two parts. The VueJS front-end (this repository) and the socket-io server back-end. 

I'm using the socket-io-client directly in my Vue component to communicate with the server.

The socket-io server repository that I used for this project is [here](https://github.com/visudo20179C/socket-server).

To learn more about socket-io in general please visit the project page [here](https://socket.io/).


# Development Instructions

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Services Directory App

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Single-page application for services directory page (Do it online). This page

## Requirements

This project assumes that you have node.js installed and the Bower along with the Grunt.js CLI also installed. For more information about these two requirements, visit [Getting started](http://gruntjs.com/getting-started).

## Getting started

Navigate to your repo in the Command Prompt or Terminal and run the ```npm install``` command. This will download all the necessary npm modules and then follow with downloading the bower components.

Then, in Finder (OSX) or Explorer (Win) navigate to your repo and double-click the ```setup.scpt``` (OSX) or ```setup.cmd``` (Win) file. This will open up a command line interface and kick-off the server where you will do most of your development.
This server will do an automatic refresh in your default browser if all the linting checks pass. It is a very handy way to develop apps. Alternatively, you can just run the ```grunt serve``` command and it will also start up the server for development.

## Development

With the development server running, watch tasks are instantiated. This means that changes you make to the HTML, SASS and Javascript files are automatically detected and the checking and compilation process are run. The process of watching and compiling will rapidly increase development times and improve code consistency as well.

Once you are happy with the application and want to deploy some development files for checking, simply run the ```grunt build:stage``` task. This will compile all the files in a state that is ready to be deployed to a server for user testing.

## Production

To build files for production, run the ```grunt build:dist``` task. This will compile and minify the files so you can deploy them to a production server.

## Testing

Install the Webdriver Manager:

```npm install```




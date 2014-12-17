# Services Directory App

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Single-page application for services directory page (Do it online). This page is used on [Do it online](http://www.qld.gov.au/services/) page and in service centre kiosks. So, it is important to keep this in mind when testing and developing.

## Requirements

This project assumes that you have node.js installed and the Bower along with the Grunt.js CLI also installed. For more information about these two requirements, visit [Getting started](http://gruntjs.com/getting-started).

## Getting started

Navigate to your repo in the Command Prompt or Terminal and run the ```npm install``` command. This will download all the necessary npm modules and then follow with downloading the bower components.

Then, in Finder (OSX) or Explorer (Win) navigate to your repo and double-click the ```server.scpt``` (OSX) or ```server.cmd``` (Win) file. This will open up a command line interface and kick-off the server where you will do most of your development.
This server will do an automatic refresh in your default browser if all the linting checks pass. It is a very handy way to develop apps. Alternatively, you can just run the ```grunt serve``` command and it will also start up the server for development.

## Development

With the development server running, watch tasks are instantiated. This means that changes you make to the HTML, SASS and Javascript files are automatically detected and the checking and compilation process are run. The process of watching and compiling will rapidly increase development times and improve code consistency as well.

Once you are happy with the application and want to deploy some development files for checking, simply run the ```grunt build:stage``` task. This will compile all the files in a state that is ready to be deployed to a server for user testing.

## Production

To build files for production, run the ```grunt build:dist``` task. This will compile and minify the files so you can deploy them to a production server.

## Testing

Only end-to-end testing has been added to the build. This is conducted with Webdriver and Protractor and is based on the principles of Behaviour-Driven Development and Test-Driven Development. You can read more about that in this article, [Testing Your JavaScript with Jasmine](http://code.tutsplus.com/tutorials/testing-your-javascript-with-jasmine--net-21229). The syntax for Webdriver is very similar to Jasmine, so it is worth doing some further investigation into the concepts and methods for this framework.

```npm install```




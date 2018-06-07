# DCE UI
This is the user interface for the DCE Admin Console.

* [Getting Started](#getting-started)
* [About the UI](#about-ui)
* [Why ReactJS?](#why-reactjs)
* [User Guide](#user-guide)


## Getting Started
Follow our guide to ensure you have the appropriate development setup on your machine. You will need Visual Studio Code for the front end UI.


## About the UI
We built the UI for our single page web app using ReactJS, React-Router for URL routing, React-Form API for the conversion forms, Fetch API to make calls to the DCE-WebAPI, and Gulp to automate deployments to our DEV environments.

## Why ReactJS?
* Fast, efficient, versatile option for creating a UI
* JSX syntax incorporates HTML with JavaScript
* Create reusable components to incorporate and combine with other components anywhere as needed, providing a consistent look throughout your app and more maintainable code
* High performance with a virtual DOM, which renders only the changes when the app updates instead of re-rendering the entire page

## User Guide
Clone the UI from
```sh
git clone [SERVER_NAME]
```
* From the cmd prompt, navigate into the dce-web folder.
* Run npm install. Verify the installs completed successfully without errors.
* Run npm start. The node start script will run and open the app at http://localhost:3000/.

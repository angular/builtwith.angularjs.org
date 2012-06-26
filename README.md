<a name="submit"></a>
# builtwith.angularjs.org

Gallery of AngularJS apps and demos.

Adding your neat thing
----------------------
1.  Fork this repository.
2.  Add a 580 by 400px thumbnail image to `projects/[yourprojectnamehere]/thumb.png`
3.  Add an entry to `projects/projects.json` with these properties:

        {
          "name": "My App",  // will be displayed under the screenshot
          "thumb": "my-app/thumb.png", // path to the image (omit the projects/ prefix)
          "desc": "Description of your app", // One or two sentences
          "url": "http://myapp.com", // url to your app
          "info": "http://myapp.com/blog", // url to explanation of app
          "src": "https://github.com/me/myapp", // (optional) Url to your source repository
          "submitter": "IgorMinar", // your github username
          "submissionDate": "2012-05-24", // current date in ISO format
          "tags": [
            "Demo", "Production", "Toy" // choose your app seriousness level (for plunks or fiddles use "Toy")
            "Game", "CRUD", "Entertainment", "Productivity", ... // choose your app type
            "Animations", "Local Storage", "Audio Api", "AppCache", ... // features and technologies
            "No jQuery", "jQuery" // do you use jQuery?
            "Open Source", // tag open source projects
            "Tests Included" // use if open source and tests are included
            ... // others?
          ]
        }

4.  Send a pull request

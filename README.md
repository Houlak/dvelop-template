# React frontend template

React template for web frontend projects

## Notes

* As new projects will be hosted on Netlify for dev and qa environments, and Netlify doesn´t compile the code when there are warnings on the frontend code, please try to avoid having them.
* Try to avoid usage of plain CSS, please try to use SASS instead.

## Imports order

We try to import all used libraries, functions, etc. on the top of the files, and in a certain order, so it is easier to search around them.
The order would be as following:

* First we import all necessary things from third party libraries (ideally, in most cases the first one would be 'react', then 'react-router-dom', etc.)
* Immediately in the next line we import all the necessary things from our project. Remember that we do not leave a line between **"external"** and **"internal"** imports.
* We order our "internal" imports following this criteria: from “more far away” to “less far away”, so in the next example, the import from `../utils/routes` comes before `./Auth/Login`

<img width="550" alt="Screen Shot 2022-05-10 at 14 14 27" src="https://user-images.githubusercontent.com/37369221/167685175-6d910214-8b5b-4726-8ef5-43fc3618efb9.png">

**Example: here we can see our criteria being applyed.**

* Before:

<img width="550" alt="Screen Shot 2022-05-10 at 13 23 39" src="https://user-images.githubusercontent.com/37369221/167680903-2fa7f514-e7f2-4cd6-a66e-0ce22dc956db.png">

* After:

<img width="550" alt="Screen Shot 2022-05-10 at 13 25 54" src="https://user-images.githubusercontent.com/37369221/167680948-23b7a12f-70d9-4708-999a-088315a854b8.png">

* Apart from that, we always need to put together imports from the same folder, and the same with imports with similar with paths. For instance, in this example, all imports from the `store` folder should be together, and the same should be done with the other folders like `components`, `assets`, etc.

* We can even go one step further and create, for example, an `index.tsx` file in the `components` folder so that we can export all of them together and then we are able to import the components that we need together in the same line:

<img width="550" alt="Screen Shot 2022-05-10 at 13 51 57" src="https://user-images.githubusercontent.com/37369221/167681684-9b399917-6b5c-4d08-9ad1-74602a98dab2.png">

<img width="550" alt="Screen Shot 2022-05-10 at 13 54 24" src="https://user-images.githubusercontent.com/37369221/167682078-153a9274-0913-4d76-8b3f-6b98449f6384.png">

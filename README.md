# React frontend template

React template for web frontend projects

## Notes

- Always try to avoid having warnings.
- Try to avoid usage of plain CSS, please try to use SASS instead.

## Imports order

We try to import all used libraries, functions, etc. on the top of the files, and in a certain order, so it is easier to browse dependencies. The order should be as following:

- First we import all necessary things from third party libraries sorted alphabetically.
- Immediately in the next line we import all the necessary things from our project. Remember that we do not leave a line between "external" and "internal" imports.
- We order our "internal" imports following this criteria: from “more far away” to “less far away”, so in the next example, the import from `../utils/routes` comes before `./Auth/Login`.
- Apart from that, we always need to put together imports from the same folder, and the same with imports with similar paths. For instance, in this example, all imports from the `store` folder should be together, and the same should be done with the other folders like `components`, `assets`, etc.

All of these rules can be automatically applied in VS Code by clicking with the second button in the file code, then clicking `Source Action...` and finally `Sort Imports`.

**Example: here we can see our criteria being applyed.**

- Before:

<img width="550" alt="Before imports order criteria being applyed" src="https://user-images.githubusercontent.com/37369221/194677882-6b87fac9-e207-4bf2-8165-7518d101100a.png">

<img width="170" alt="Source Action..." src="https://user-images.githubusercontent.com/37369221/194677891-88aae041-d61b-48cf-961f-548b6e42282b.png"> <img width="220" alt="Sort Imports" src="https://user-images.githubusercontent.com/37369221/194677898-f127d26c-a19c-4c4d-ac1c-b2f263efc0b3.png">

- After:

<img width="550" alt="After imports order criteria being applyed" src="https://user-images.githubusercontent.com/37369221/194677970-807a2408-c4d9-4133-8ac8-db93692d847f.png">

But this is not even necessary. If in the `.vscode/settings.json` file we have this configuration inside, the imports will sort automatically whenever we save that file:

```
  "editor.codeActionsOnSave": { "source.organizeImports": true }
```

### Going one step further...

We can even go one step further and create, for example, an `index.tsx` file in the components folder so that we can export all of them together and then we are able to import the components that we need together in the same line:

- Before:

<img width="800" alt="Going one step further... Before" src="https://user-images.githubusercontent.com/37369221/194678089-a9581525-fc6e-4436-afa4-42de5c10d31e.png">

- After:

<img width="800" alt="Going one step further... After 1" src="https://user-images.githubusercontent.com/37369221/194678093-5a5b5d9b-e82f-4145-990e-f04c64fa6c03.png">

<img width="500" alt="Going one step further... After 2" src="https://user-images.githubusercontent.com/37369221/194678097-78babf4e-6ec1-4399-8b4f-7fd5b3c8e45a.png">

# ui5-task-pug

Task (and **Middleware**) for transpiling [pug](https://pugjs.org) files into xml.

# Installation

Add the task to your project as a dev dependency.
```sh
npm i -D @todms/ui5-task-pug
```

Add the package to the ui5 dependencies of `package.json`
```yaml
"ui5": {
  "dependencies": [
    #...
    "@todms/ui5-task-pug"
  ]
}
```

# Include Task and Middleware

Include the task in `ui5.yaml`

Task:

```yaml
builder:
  customTasks:
    - name: ui5-task-pug
      beforeTask: generateComponentPreload
```

Server Middleware:

```yaml
server:
  customMiddleware:
    - name: ui5-middleware-pug
      beforeMiddleware: serveResources
```

# Configuration

By default all `.pug` files will be transformed to `.xml` files

## Task Configuration

You can add the following configurations to the task:

| Name           | Type                 | Default                        | Description                                           |
| -------------- | -------------------- | ------------------------------ | ----------------------------------------------------- |
| include        | `string \| string[]` | `[**/*.pug]`                   | Files that should be included                         |
| exclude        | `string \| string[]` | `[]`                           | Files that should not me excluded                     |
| pugOptions     | `Object`             | `{}`                           | Options that will be passed to the pug template       |
| forceExtension | `string \| false`    | `xml`                          | Force a specific file extension for transformed files |

## Middleware Configuration

You can add the following configurations to the middleware:

| Name          | Type                 | Default                        | Description                                                                                                     |
| ------------- | -------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| include       | `string \| string[]` | `[**/*.xml]`                   | Files that should be included                                                                                   |
| exclude       | `string \| string[]` | `[]`                           | Files that should be excluded                                                                                   |
| pugOptions    | `Object`             | `{}`                           | Options that will be passed to the pug template                                                                 |
| searchInclude | `string \| string[]` | `[**/*.pug]`                   | Files that should be included when searching the project for fitting files                                      |
| passFile      | `boolean`            | `false`                        | Wether the file should be passed to the next middleware (Only works if next middleware checks `req.passedFile`) |

# Examples

## Using options in template
Add pug options to the task configurations
```yaml
# ui5.yaml
builder:
  customTasks:
    - name: ui5-task-pug
      beforeTask: generateComponentPreload
      configuration:
        pugOptions:
          myVariable: "Hello World"
```

Use them in the template
```pug
//- Main.view.pug
Button(text=myVariable)
```

Output:
```xml
<!-- Main.view.xml -->
<Button text="Hello World"></Button>
```
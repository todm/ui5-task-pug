# ui5-task-pug

Task (and **Middleware**) for transpiling [pug](https://pugjs.org) files into xml.

> **Changes in v3**
>
> -   Support for specVersion 3
> -   Support for includes and inheritance
> -   Middleware now allways passes results to next middleware
> -   Configuration changes
>     -   `pugOptions` renamed to `pugVariables`
>     -   removed `passFile`
>     -   added `pretty` option for formatted outputs
>     -   added `searchExclude` to middleware

# Installation

Add the package to your project as a dependency.

```sh
npm i -D @todms/ui5-task-pug
```

Include the task and middleware in your ui5.yaml file

```yaml
specVersion: '3.0'
#...
builder:
    customTasks:
        - name: ui5-task-pug
          beforeTask: generateComponentPreload
server:
    customMiddleware:
        - name: ui5-middleware-pug
          beforeMiddleware: serveResources
```

# Configuration

By default all `.pug` files will be transformed to `.xml`

You can configure the behaviour by providing the configuration object in ui5.yaml

**Task Configuration**
| Name | Type | Default | Description |
| ------- | ------------------- | -------------- | ----------- |
| include | `string \| string[]` | `['**/*.pug']` | Files that should be included |
| exclude | `string \| string[]` | `[]` | Files that should be excluded |
| pugVariables | `object` | `{}` | Variables that will be passed to the pug template |
| pretty | `boolean` | `false` | Adds whitespace to the resulting HTML to make it easier for a human to read |
| forceExtension | `string \| false` | `xml` | Force a specific file extension for transformed files |

**Middleware Configuration **
| Name | Type | Default | Description |
| ------- | ------------------- | -------------- | ----------- |
| include | `string \| string[]` | `['**/*.xml']` | Files that should be included |
| exclude | `string \| string[]` | `[]` | Files that should be excluded |
| searchInclude | `string \| string[]` | `['**/*.pug']` | Files that should be included when searching the project for fitting files |
| searchExclude | `string \| string[]` | `[]` | Files that should be excluded when searching the project for fitting files |
| pugVariables | `object` | `{}` | Variables that will be passed to the pug template |
| pretty | `boolean` | `false` | Adds whitespace to the resulting HTML to make it easier for a human to read |
| onError | `'next'\|'error'\|'exit'` | `'error'` | Defines behaviour when an error occures.<br> `next`: next middleware will be called, <br>`error`: server will return 503, <br>`exit`: Server will end |

# Examples

**Variables**

```yaml
# ui5.yaml
builder:
    customTasks:
        - name: ui5-task-pug
          beforeTask: generateComponentPreload
          configuration:
              pugVariables:
                  myVariable: 'Hello World'
```

```pug
//- Main.view.pug
Text(text=myVariable)
```

Outputs:

```xml
<!-- Main.view.xml -->
<Button text="Hello World"></Button>
```

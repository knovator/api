# @knovator/api

`@knovator/api` provides simple wrapper for api calls and makes it much easier to mange your api calls. It provides two methods `fetchUrl` and `setAPIConfig`.

## setAPIConfig

You need to set wrapper's config one time before calling api. You can find docs for it.

| config        | type                   | use                                                          |
| ------------- | ---------------------- | ------------------------------------------------------------ |
| `getToken`    | `function` or `string` | for private APIs getToken method to get an updated token from localStorage or state or it's up to you and you also pass a string to it |
| `baseUrl`     | `string`               | API endpoint url `(Note:do not pass '/' at the end of url)`  |
| `prefix`      | `function` or `string` | You can use a common prefix between API Endpoint and the URL of API. a prefix is an optional parameter. A prefix can be the function as well as string type. If you are using prefix as a function then you will get your passed config in arguments. |
| `onError`     | `function`             | It is optional but if you pass function then it will be called on any error in API |
| `handleCache` | `boolean`              | To enable API cancellation set it true. When enabled,  If the last API URL and the current API URL are the same then the last API will get canceled to prevent unnecessary API calls. |

```jsx
import { setAPIConfig } from "@knovator/api"

const getToken = () => {
    // do something and return token for authorization
    return token
}

setAPIConfig({
    getToken: getToken(),
    prefix: 'admin',
    baseUrl: `${process.env.FETCH_URL}`,
})
...
```



## fetchUrl

#### fetchUrl takes single parameter under that

| Param  | Use                                                          | Default Value |
| :----: | :----------------------------------------------------------- | :-----------: |
|  type  | type of api call like `get`, `post` etc.                     |     `get`     |
|  url   | is is url of your api call (not including endpoint of api). refer Example to understand it |   undefined   |
|  data  | payload that you want to pass in api                         |      {}       |
| config | some configurations like headers, authToken (default true) and hash |      {}       |

```jsx
import fetchUrl from "@knovator/api"

function App() {
    ...
    useEffect(() => {
        // for get method
        fetchUrl({
            url: 'users'
        }).then(res => console.log('success', res))
        // for post or other method
         fetchUrl({
            method: 'post',
            url: 'user'
            data: { name: "VimLeSai" }
        }).then(res => console.log('success', res))
    }, [])
    ...
}
```


# Loading Performance Tweaks

## [The Cost of Javascript](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4)
A seminal post by Addy Osmani about most performance things related to JavaScript processing. Keep it close in your favorites, keep studying it and applying its concepts.

The two important factors that you need to be aware of while serving JavaScript to your user's browsers are:
- Transfer size over the network
- Processing time in the browser

Like any other download on the web, the smaller the file size, the faster it is to transfer it. Every byte is equal while transfered but once it's time to be processed by the browser, it's completely different.

A JPEG image needs to be 
1. dowloaded
1. decoded
1. rasterized
1. painted on the screen.
Another advantage is that there's a bunch of dedicated hardware out there to accelerate this process.

A JavaScript bundle needs to be 
1. downloaded
1. parsed
1. compiled
1. executed
1. And there are a number of other steps that an engine needs to complete. Just be aware that these costs are not quite equivalent.
No dedicated hardware acceleration for JS.

Specially considering mobile phones and celular networks. The great majority of people in the world use low-cost phones on a 3G network. Therefore, if your site/webapp is trully global, you have to work extra hard to make sure every one has a great experience.

Today we're going to focus on a narrow set of problems and some techniques on how to avoid them using React.

1. **Lazy load needed components**
1. **Ship modern JavaScript bundles**

## Lazy load needed components
May the fun start and let's dive into some code now! I used `CRA` to bootstrap this very simple React app that has 3 misterious buttons that when clicked opens up a modal with an image. Only one modal can be opened! The `<Modal>` component deals with all modal things and renders the given children inside the modal when it's open. The only problem is that the components that render the images are huge:
* Death: 120kb
* Gandalf: 212kb
* Magneto: 107kb

Which means that the production `main.js` is considerably large: `442kb`. And the worst part is that since there's a bunch of KBs wasted since only one modal can be opened! Some browser stats:
* Initial load: `834kb` transfered, Load: `3.38s` (Fast 3G)

So the path forward is clear: only load the code needed for the chosen button.

### Native dynamic imports
Let's try our own take using just native JavaScript with the new `dynamic imports` [functionality](https://github.com/tc39/proposal-dynamic-import).

It takes a path to a file and returns a `Promise` the promise is resolved once the file and its dependencies are downloaded, parsed, compiled and executed.

```
const Module = await import("./module");
```

We add a new prop to the `Modal` component called `defaultComponentPath` (for simplicity let's just support default exports), and add a function for loading the module `loadModule()` to be invoked when the modal is opened. And to improve the UX, we render a `loading...` message while the module loads.

And now if we do another production build and check the file sizes we can see a lot of different things:
* Many more chunk files were generated
* We can identify some of the chunks by their file sizes (images)
* `main.js` just `4.1kb`!
* Initial load: `507kb` transfered, Load: `1.62s` (Fast 3G)

### Extra: webpack tips
CRA uses webpack to bundle our app so we can take advantage of its [ES6 Import Magic Comments](https://webpack.js.org/api/module-methods/#magic-comments) to help us track and fine tune the generated chunks.
* /* webpackChunkName: "lazy-ian" */ : all chunks related to the lazy imports have the same name
* /* webpackMode: "lazy-once" */ : bundles all the 3 lazy children into a single chunk (??)

### Extra: [Webpack Libs Optimization tips](https://github.com/GoogleChromeLabs/webpack-libs-optimizations#babel-polyfill)


### React's lazy APIs
Our code works fine but at the same time it's a lot of boiler plate that we have to test and maintain. Thankfully React provides the same functionality out of the box. The `React.lazy` function lets you render a dynamic import as a regular component.

Before:
```
import OtherComponent from './OtherComponent';
```

After:

```
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

This will automatically load the bundle containing the `OtherComponent` when this component is first rendered.

`React.lazy` takes a function that must call a dynamic `import()`. This must return a `Promise` which resolves to a module with a `default export` containing a React component.

The lazy component should then be rendered inside a `Suspense` component, which allows us to show some fallback content (such as a loading indicator) while we’re waiting for the lazy component to load.

Once we refactor our code, it looks more declarative and cleaner since all the boiler plate is gone.

* `main.js` just `2.7kb`!!! (the boiler place lives in React's `runtime` chunk)
* Initial load: `504kb` transfered, Load: `1.61s` (Fast 3G)

Another bonus is that this API is already compatible with React's `ErrorBoundary`. Our boiler plate code had no error handling...

## Ship modern JavaScript bundles
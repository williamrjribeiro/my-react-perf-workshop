# Loading Performance Tweaks

## [The Cost of Javascript](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4)
A seminal post by Addy Osmani about most performance topics related to JavaScript processing. Keep it in your favorites bar for quick references and study.

Loading performance is a huge topic so we'll focus only on two important factors:
- Transfer size over the network
- Processing time in the browser

Like any other download on the web, the smaller the file size, the faster it is to transfer it. The data shows most people are not using a high-end phone connected to a fast and stable internet connection. Therefore, if your site/webapp is truly global, you have to work extra hard to make sure everyone has a great experience.

## All bytes are not equal
Every byte is equal while transferred but once it's time to be processed by the browser, it's completely different.

For example, a JPEG image needs to be:
1. downloaded
1. decoded
1. rasterized
1. painted on the screen

A JavaScript bundle needs to be:
1. downloaded
1. parsed
1. compiled
1. executed
1. And there are several other steps that an engine needs to complete.

Also, be aware that these costs are not quite equivalent. Many devices have hardware acceleration for graphics processing which offloads the CPU. No dedicated hardware acceleration for JS, just CPU.

Today we're going to focus on just one technique which is lazy loading code.

And just remember: don't optimize your application too early! Keep measuring your performance indicators and optimize gradually when needed.

## Lazyness
`Lazy loading` is a common technique for loading resources on demand. Its "cousin" is `eager loading` which is loading extra resources before they are needed. Both are strategies for improving loading performance which then improves the overall perceived performance.

The idea is simple: 
* at first download only the critical code needed to start up the application
* load extra stuff when requested/needed - lazy
* whenever resources are idle - eager

Implementing it is not that trivial. Some things to consider:
1. What is the critical code? Global dependencies like frameworks and styles? Landing screen?
1. How to split the application in chunks for lazy loading? Split by components? By features? By pages? By packages? It really depends on the app.
1. How to configure the build system to provide the right chunks? Toolset specific.

## Sir Ian McKellen App
May the fun start! I used `CRA` to bootstrap this very simple React app that has 3 mysterious buttons that when clicked opens up a modal with an image of the great Sir Ian McKellen. Only one modal can be opened though!

* QUICK WALK THROUGH THE CODE *

The `<Modal>` component deals with all modal bits: trigger button, popup, closing. It renders the given children inside the modal when it's open. The main problem is that the components that render the images are huge:
* Death: 120kb
* Gandalf: 1.3MB
* Magneto: 107kb

This means that the production build of `main.js` is considerably large: `1.08 MB`. And the worst part is that since there's a bunch of KBs wasted since only one modal can be opened! Some browser stats:
* Initial load: `2.0 MB` transfered, Load: `9.52s` (Fast 3G)

So the path forward is clear: stop loading all images and lazy load just the one that is needed when needed.

### Native dynamic imports
I usually start with the API. I would like the Modal component to load a given component by its source path:

```
<Modal {...props} componentPath="./Magneto" />
```

I know it's a bit weird that the Modal is handling this kind of functionality but let's see how it goes.

We add a new prop to the `Modal` component called `defaultComponentPath` (for simplicity let's just support default exports),  remove the original `children` prop and add a function for loading the module `loadModule()` to be invoked when the modal is opened.

And to improve the UX, we render a `loading...` message while the module loads. For that, we need a new state variable that holds the module itself.

Can we use `fetch`, like we always do? Unfortunately not because the fetch would load just the source file as plain text. Could we do *sick* `eval()`? Also not because the loaded component also has its own dependencies and `eval` doesn't handle that. **And it's also evil.**

Fortunatelly there's a native JavaScript functionality for exactly this use case: `dynamic imports` [functionality](https://github.com/tc39/proposal-dynamic-import)

It takes a path to a file and returns a `Promise`. The promise is resolved once the file and its dependencies are downloaded, parsed, compiled, and executed.

```
const lazyModule = await import("./module");
```

Now we just need to instantiate the lazy module and update the component state. 

Uh oh! 

There are some caveats with dynamic imports. The build system must know ahead of time, during compilation, what are the dynamically loaded assets or else it can't export the chunks correctly. Right now, the Modal component is a complete black-box for the build system because the `defaultComponentPath` prop is obscuring the path. Probably this is a limitation that they can overcome with updates to Webpack but for now, we have to get rid of the black-box.

The trick is to place the prop in an expression. This triggers Webpack to evaluate correctly at build time.

And now if we do another production build and check the file sizes we can see a lot of different things:
* Many more chunk files were generated
* We can identify some of the chunks by their file sizes (images)
* `main.js` just `1.61kb`!
* Initial load: `504kb` transfered, Load: `1.66s` (Fast 3G)

Hooray! What an improvement. The code though... ugh. It's not dealing with failures, the dynamic loading code is implemented in an awkward place, it's really hard to test...it's a lot of plumbing that we don't want to deal with.

Thankfully React is working on this functionality for us and already provides it as an [**experimental** feature](https://reactjs.org/docs/concurrent-mode-suspense.html).

### React's lazy APIs
The `React.lazy` function lets you render a dynamic import as a regular component. `React.lazy` takes a function that must call a dynamic `import()` and the returned `Promise` must resolve to a module with a `default export` containing a React component.

Before:
```
import OtherComponent from './OtherComponent';
```

After:

```
// wrap the dynamic import with React.lazy and use it as a regular Component
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

This will automatically load the bundle containing the `OtherComponent` when it is first **rendered**.

Then, the lazy component should be rendered inside a `Suspense` component, which allows us to show some fallback content (such as a loading indicator) while we’re waiting for the lazy component to load.

Once we refactor our code, it looks more declarative and cleaner since all the boilerplate is gone.
1. Create lazy components: `LazyDeath`, `LazyGandalf` & `LazyMagneto`
1. Replace prop `defaultComponentPath` with `children`
1. Remove the `lazyChildren` state and `loadModule` function and calls
1. Render the `children` in `<Suspense>` with a `<div>loading...</div>` fallback.
1. Pass the lazy children to the modals in the `<Loading>` component.

TA DAAAH! All is working again and the chunks are loaded correctly. If we rebuild our app we can check the size differences.

* `main.js` just `1.1kb`!!!
* Initial load: `505kb` transfered, Load: `1.62s` (Fast 3G)

Another bonus is that this API is already compatible with React's `ErrorBoundary`. Our boilerplate code had no error handling... We just add `<MyErrorBoundary>` to `index.js`

### Extra: webpack tips
CRA uses Webpack to bundle our app so we can take advantage of its [ES6 Import Magic Comments](https://webpack.js.org/api/module-methods/#magic-comments) to help us track and fine-tune the generated chunks.

For instance, to name a chunk, add `/* webpackChunkName: "CHUNK_NAME" */` inside the `import()` call and it will name the chunk accordingly.

Also, check [Webpack Libs Optimization tips.](https://github.com/GoogleChromeLabs/webpack-libs-optimizations#babel-polyfill)

## CHALLENGE: EAGER LOADING
Try to implement these
1. Whenever the mouse cursor hovers the modal trigger button, eager load the Ian module.
1. Whenever the app is idle, eager load all Ian modules.

## Extra: movie references
* [Death appears on Last Action Hero (1993)](https://www.imdb.com/title/tt0107362/?ref_=ttmi_tt)
* [Gandalf the Grey appears on The Lord of Rings Trillogy (2001)](https://www.imdb.com/title/tt0120737/?ref_=nv_sr_srsg_0)
* [Magneto appears on the X-Men Trillogy (2000)](https://www.imdb.com/title/tt0120903/?ref_=nv_sr_srsg_0)
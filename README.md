# My React Perf Workshop

First things first: `yarn && yarn start`. You should see app working in the browser.

```
WARNING: This app can crash your browser and make your computer unresponsive!
```
## Part 1
In front-end web development there are 2 *key* performance indicators, amongst others:
1. Time to interact: how long does it take until your website loads and is interactive? Load perf.
1. Fast and smooth: are animations and updates fast enough while user interacts? Render perf.

React is a framework that provides tools and functionalities for optimizing both. Unfortunately due to time constraints,
today we're going to focus just on a few React tricks to optimize rendering performance.  

### Defining a performance goal.
If you don't have a goal, or a minimal required FPS, then it's just guess work. This goal will dictate the efforts your
engineers will put in for optimizing the code. Optimized code is usually complex and not easy to test. Unfortunately there's 
no way for the user to tweak the visual settings of your app, like in a computer game, so it runs smoother in their device.

Ideally you want your app re-rendering at 60FPS all the time or as close as possible. Cinema movies render at 24FPS but 
that's not nearly good enough for today's interactive apps. Every second, your app must
update 60 times so every frame lasts only 16ms. This can be quite the challenge specially in low cost mobile phones.

For the purposes of this workshop, let's go for **60FPS in Safari running on a MacBook Air from 2015**.

### React Dev Tools
It's also highly recommended to use [React Dev Tools](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-devtools-profiler). It shows very specific React information. Make sure it's working because we'll be using it shortly.

### React Production Builds
Currently, we're running in dev mode (check terminal!). It has a lot of code for connecting to dev tools, notifying erros and etc. Our users will
never run the dev build, only the production build. Therefore we must measeure its performance:
`yarn build && npx serve -s build`
*Interaction frame: 821ms ~1FPS*

Notice that React Dev Tools stoped working. This is because the production is bare minimal. We have to enable the profile build which has
enough code necessary to profile our apps.
`yarn build --profile && npx serve -s build`
*Interaction frame: 850ms ~1FPS*

 We can see that the function `isPrime` is what's killing the performance. OK, time to dig into the code and try to solve this.

## Part 2

1. Quick dive from `<App> => <PrimeInput> => <PrimeChecker> => isPrimeNumber()`
1. Show `<CoolBtn>` animations. Explain that they are done in CSS. Show that holding up key to increase number blocks mouse over animations.

#### Using React Profiler
1. Select `Profiler*` from React Dev Tools Extension
1. Click the `Gear Icon` to open the settings
1. Select `Profiler` tab and enable `Record why each component rendered while profiling.`
1. Hit `Record` button to start.
1. Change color twice.
1. Change number once.
1. Hit `Record` button to stop.

Now let's examine the profiling session:
1. Explain the rendered commit squares
1. Note timmings of each commit and component:  `360ms, 349ms, 636ms`.
1. Show `Why did it render?` hover info: color and number.
1. The color of a bar indicates how long the component (and its children) took to render in the selected commit. `Yellow` components took more time, `blue/teal` components took less time, and `gray` components did not render at all during this commit.

EXERCIZE: what re-renders and why when disabling and enabling `<PrimeInput>`?

### First: useMemo(isPrime)
Function Memoization is a technique for caching results of function calls. It's common technique and there's a bunch of implementations out there. React's the hook `useMemo`. Pass a “create” function and an array of dependencies. useMemo will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.
Memoize the `isPrime` function, **rebuild in profile mode** and measure.

1. `<PrimeChecker>` has two props:
    - `number`: everytime it changes, we have to call the expensive function and render the text output.
    - `color`: changes the text output but when it changes no need to re-calculate if it's the same number.
    Show that changing color calls `isPrime` unnecessarily. Measure it!

*Change just color twice, change number: 1.2ms, 0.4ms, 628ms*

### Second: React.memo(PrimeChecker)
When we change the enabled prop, it only affect the `<input>` element so there's no need to re-render `<PrimeCjecker>` because both of its props
didn't change. The Profiler tool tell us that the reason why it rendered was because of parent component. This is the place for `React.memo`:
is a higher order component. In other words, it generates a `decorated` component based on the given component.

```
const Box = (props) => <div className="box" {...props}></div>
const MemoBox = React.memo(Box)
<MemoBox title="memoized box">
```

EXERCIZE: Use a memoized version of `<PrimeChecker>`
*Change just color twice, change number: 0.9ms, 0.3ms, 640ms*

EXERCIZE: Use a memoized version of **every** component!
Notice that:
1. When color changes, nothing from the parent re-renders unnecessarily. =)
1. When `disabled` prop changes, just `<PrimeChecker>` did not re-render. Even memoized `<CoolBtn>` re-rendered. =(

EXERCIZE: Why did `<InRow>` change? Because it's children changed and `children` is a prop.
EXERCIZE: Memoize every internal component of `<PrimeChecker>`.
EXERCIZE: Prevent `<InRow>` from re-rendering unnecessarily.

### Third: useCallback
Everytime a component renders, it creates a **new** inner function for the event handlers. Since the prop changes, the component re-renders.

One way to prevent this would be to define the handler function *outside* of the component. Unfortunatelly, all our event handlers depends on a
state setter of a component. Since this is so common, React provided a way to keep the same event handler callback between renders: `useCallback` hook. Pass an inline callback and an array of dependencies. `useCallback` will return a memoized version of the callback that only changes if one of the dependencies has changed.

```
// to get an optimized version of your function, useMemo if it returns a value or useCallback if it doesn't
const aFunctionOptimized = returnsValue(aFunction) ? useMemo(aFunction, [...]) : useCallback(aFunction, [...])
```

1. useCallback every event handler. Don't add state setters as dependency.
EXERCIZE: What happens when a state prop is **not** added to the event handler dependency on `useCallback`? Callback does not run and component does not update.

### Extra: custom memoize isPrime
That's it in terms of React APIs for manually optimizing component renders. It's indeed a bit dumb that we have to write pumbling to optimize the framework. Not to mention all the code needed for this to work that's shipped to our customers. And still our app is "slow":
1. focus on input
1. press key up: calls `isPrime` since number has changed
1. press key down: calls `isPrime` since number has changed... but we already know the results of these numbers!

Why did it run if we're using `useMemo`?! Because the hook dependency changed: `number`. And that's React how it works. 🤷‍♂️

To solve this we need to memoize `isPrime` ourselves. Let's implement a generic utility memoize function just to ilustrate:
// memoize.js

Now it's awesome! For our contrived example, only this extra optimization would have been enough.
EXERCIZE: Revert all the optimizations we did and use only our `memoize(isPrime)`.
Please use a better implementation: https://lodash.com/docs/4.17.15#memoize

## Part 3: a more realistic example
TODO
TODO
TODO

## Part Extra: Measuring perf with Chrome Dev Tools
Open up the app, focus in the number input field and press up or down keys to change its value.
Yep, doesn't look good. Let's use the Chrome Dev tools to find out what's the root cause of the problem.

1. Open Chrome Dev Tools: right click on page and select `Inspect`. *WARNING: dev tools consume much more resources!*
1. Open the `Performance` tab.
1. Press `Esc` key to show bottom drawer.
1. Select the `Performance monitor` from the 3 vertical dots on the left.
1. Select the `Rendering` from the same menu. Turn on `FPS` and notice how Chrome saves our batteries!
1. In the `Performance` tab click the `Record` button, focus in the page input, press key up/down, and stop recording.

Always keep track of FPS and timings so we can monitor our progress:
*Interaction frame: 880ms ~1FPS*

Notice huge orange/yellow peak and the red bar above it. The former is `Scripting` and the latter indicates a frame took longer
than 16ms to update. Much more than what we need!

We can see that this function `e` is taking a lot of time to run. Select it and in the `Summary` tab we can click in its
source code. And it's unreadable for us because this is production.

Another good tip is that Chrome can throttle CPU and the Network connection:
1. Select `Performace` tab.
1. Click the cog on the top right to open a pannel.
1. Select `CPU: 6x slowdown`.

This is not a CPU emulation or anything. It just slows down the internal event loop.
























## General

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

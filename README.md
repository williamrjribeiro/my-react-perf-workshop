# My React Perf Workshop

```
WARNING: This app can crash your browser and make your computer unresponsive!
```
This is not a workshop for beginners in React but not for experts either. Hopefully, after this workshop, you'll be introduced to some intermediate knowledge.

Ready to start? Let's go!

## Part 1
In front-end web development there are 2 *key* performance indicators, amongst others:
1. **Time to interact:** how long does it take until your website loads and is interactive? Load perf.
1. **Fast and smooth:** are animations and updates fast enough while the user interacts? Render perf.

React is a framework that provides tools and functionalities for optimizing both. Unfortunately due to time constraints,
today we're going to focus just on a few React tricks to optimize rendering performance. Maybe in the future, I can do another workshop just with React APIs for improving loading performance.

### Defining a performance goal.
If you don't have a goal, or a minimum required FPS, then it's just guesswork. This goal will dictate the efforts your
engineers will put in for optimizing the code. Optimized code is usually complex and not easy to test. Unfortunately, there's no way for the user to tweak the visual settings of your app to get a better performance like in a computer game.

Ideally, you want your app re-rendering at 60FPS all the time or as close as possible. Why 60? Because that usually the refresh rate of most flat-panel displays: 60HZ. Every second, your app must update 60 times so every frame lasts only 16ms. This can be quite a challenge, especially in low-cost mobile phones.

Cinema movies run at 24FPS but that's not nearly good enough for today's interactive apps. Gaming displays have up to 240HZ and even recent high-end phones have 120HZ displays.

For the purposes of this workshop, our goal will be **60FPS in Safari running on an iPhone 8**.

### React Dev Tools
It's also highly recommended to use [React Dev Tools](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-devtools-profiler). It shows very specific React information. Make sure it's working because we'll be using it shortly.

### Demo App
1. A silly app that tells if a number is prime or not. There's a button to disable the input, another to change the `not` color and one for resetting.
1. All the button animations are done in CSS which runs on a separate browser thread and it's very optimized. But it still janks!

### React Production Builds
Currently, we're running in dev mode (check terminal!). It has a lot of code for connecting to dev tools, notifying errors and etc. Our users will never run the dev build, only the production build. Therefore we must measure the prod build performance:
`yarn build && npx serve -s build`

*Render duration: ???*

Notice that React Dev Tools stopped working. This is because the production is minimal. We have to enable the profile build which has
enough code necessary to profile our apps.
`yarn build --profile && npx serve -s build`

1. Click the `Load and start profiling` button so that we measure how long it takes to render the whole app for the 1st time.
1. Once the `Load` and `Save` profile buttons are enabled, stop the profiling session.
1. To the right, you'll find the `Rendering commits` which shows how many times `react-dom` rendered in that session. React uses a two-phase concept: `render` phase where all the virtual DOM checking happens and the `commit` phase where the output pipeline kicks in transforming components into visible elements. Tall yellow bars are a bad sign. Select it so we can check its stats.

Finally, we can track a number that will reflect the changes that we make in the code. Our goal is that most commits take less than 16ms and right now it's missing waaaaay much.

*Render duration: 2011.4ms*

Let's try to understand what's causing such horrible performance by inspecting the `Flamegraph chart`. This one tries to mirror our component tree as shown in the `Components` panel: top is our root component and bottom are the leaf components. They also show the hierarchy of components. The time a component takes to render is its own time plus its children's time.

 We can see that the component `<PrimeChecker>` is what's killing the performance. This is as far as the React Devtools Profiler can help us: point to the right component but *not exactly what in* the component.

 In the `Ranked` panel, it shows a bar chart with all the components and elements in the page sorted in descending order of commit time. Funny enough, it shows more components than the flamegraph because PrimeChecker is taking so much more time than all the other components that it changes the time scale from `ms` to `s`. To change the reference of this graph, just pick a different component.
 
 OK, time to dig into the code and try to solve this.

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
1. Note timings of each commit and component:  `360ms, 349ms, 636ms`.
1. Show `Why did it render?` hover info: color and number.
1. The color of a bar indicates how long the component (and its children) took to render in the selected commit. `Yellow` components took more time, `blue/teal` components took less time, and `gray` components did not render at all during this commit.

**EXERCISE:** what re-renders and why when disabling and enabling `<PrimeInput>`?

### Strategies
Now that we know where all the workload is, we can try a few things to make sure it's fast:
1. **Don't do it in JS:** if possible, of course. Not our case yet but we'll cover this later in the workshop.
1. **Optimize the workload:** use a better algorithm, tweak current implementation, parallelize, etc...This is not React related so I won't focus on this.
1. **Avoid running workload unnecessarily:** React provide a bunch of APIs for dealing exactly with this.

### First: useMemo(function)
Function Memoization is a technique for caching results of function calls. It's a common concept and there's a bunch of implementations out there. React's the hook `useMemo`. Pass a “create” function and an array of dependencies. `useMemo` will only recompute the memoized **value** when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.
Memoize the `isPrime` function, **rebuild in profile mode**, and measure.

1. `<PrimeChecker>` has two props:
    - `number`: every time it changes, we have to call the expensive function and render the text output.
    - `color`: changes the text output but when it changes no need to re-calculate if it's the same number.
    Show that changing color calls `isPrime` unnecessarily. Measure it!

*Change just color twice, change number: 1.2ms, 0.4ms, 628ms*

### Second: React.memo(Component)
When we change the enabled prop, it only affects `<CoolInput>` component so there's no need to re-render `<PrimeChecker>` because both of its props didn't change. The Profiler tool tells us that the reason why it rendered was because of the parent component. This is the place for `React.memo`: it's a Higher Order Component applied to other components. In other words, it generates a `decorated` component based on the given component.

```
const Box = (props) => <div className="box" {...props}></div>
const MemoBox = React.memo(Box)
<MemoBox title="memoized box">
```

**EXERCISE:** Use a memoized version of `<PrimeChecker>`
*Change just color twice, change number: 0.9ms, 0.3ms, 640ms*

**EXERCISE:** Use a memoized version of **every** component!
Notice that:
1. When the color changes, nothing from the parent re-renders unnecessarily. =)
1. When `disabled` prop changes, just `<PrimeChecker>` did not re-render. Even memoized `<CoolBtn>` re-rendered. =(

**EXERCISE:** Why did `<InRow>` change? Because its children changed and `children` is a prop.
**EXERCISE:** Memoize every internal component of `<PrimeChecker>`.
**EXERCISE:** Prevent `<InRow>` from re-rendering unnecessarily.

### Third: useCallback(callback)
Every time a component renders, it creates a **new** inner function for the event handlers. Since the prop changes, the component re-renders.

One way to prevent this would be to define the handler function *outside* of the component. Unfortunately, all our event handlers depend on a
state setter of a component. Since this is so common, React provided a way to keep the same event handler callback between renders: `useCallback` hook. Pass an inline callback and an array of dependencies. `useCallback` returns a memoized version of the **callback** that only changes if one of its dependencies change.

```
// to get memo version of your function, useMemo if it returns a value or useCallback if it doesn't
let memo;
if(returnsValue(aFunction)) {
    memo = useMemo(aFunction, [...]) // memo has a VALUE
} else {
    memo = useCallback(aFunction, [...]) // memo has a FUNCTION
}
```

1. `useCallback` every event handler.

**EXERCISE:** What happens when a state prop is **not** added to the event handler dependency on `useCallback`? What if the state update function is omitted? Callback does not run and the component does not update.

[Hooks FAQ has a lot of useful details](https://reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)

### Extra: custom memoize isPrime
We have covered all of React APIs for manually optimizing component renders. 🎉 It's indeed a bit dumb that we have to write all this plumbing to get the most out of the framework. And if the code is there, shouldn't it be tested? Not to mention all the code needed for this to work that's shipped to our customers. And still, our app is "slow":
1. focus on input
1. press key-up: calls `isPrime` since the number has changed
1. press key-down: calls `isPrime` since the number has changed... but we already know the results of these numbers!

Why did it run if we're using `useMemo`?! Because the hook dependency changed: `number`. And that's how React works. 🤷‍♂️

To solve this we need to memoize `isPrime` ourselves. Let's implement a generic utility memoize function just to illustrate:

// memoize.js

Now it's awesome! For our contrived example, only this extra optimization would have been enough.
**EXERCISE:** Revert all the optimizations we did and use only our `memoize(isPrime)`. Is it enough?
**EXERCISE:** Use a [lodash's implementation](https://lodash.com/docs/4.17.15#memoize). It's safer!

## Part 3: a more realistic example
In this example, we have the `<Invitations>` component. It gets a `dealer` as prop that could have been obtained via OIDC.
The component will then fetch its profile picture and the list of customers associated with the dealer. It uses 3 states to implement its functionalities and everything is on the same component.

What happens if one of the state props changes? The whole component re-renders! The current performance is terrible: 
- the row's hover effect was not implemented via CSS but in React instead.
- Waaaaayy to many rows rendered on the page. This is horrible for performance by design...

To drastically improve the performance of this component you don't need any of the advanced techniques I showed before. Only proper componentization will do the trick. Components should take care of their state!

What's the state that changes the most? `hoveredCustomer`. It re-renders and compares every single entry to add or remove the CSS class.
So let's focus just on this interaction: we don't want to re-render everything when the mouse is over a row, just want to re-render that specific row. And whenever the mouse is out, we remove the class. So every row has to control its own state `isHovered.`

// Invitations.enough.jsx

**EXERCISE:** Make sure the customer table is not re-rendered when the profile picture is loaded.

## Part 3.1: virtualization
If you really really reaaaaally have to render a huge table/list on the screen, you'll have to use virtualization: instead of rendering hundreds of elements, render just a dozen needed to fill a viewport and re-use them as needed. For that, just use [react-window](https://github.com/bvaughn/react-window)

![List](https://webdev.imgix.net/virtualize-long-lists-react-window/window-diagram.jpg)
![Grid](https://webdev.imgix.net/virtualize-long-lists-react-window/window-diagram-grid.jpg)

**EXERCIZE: ** use `react-window` on `<CustomerTable>`

## Part 4: useContext() tips
Sorry, no time to go through the little tricks and gotchas today. But all the concepts, strategies, and APIs we learned today can be applied.

## Part Extra: Measuring perf with Chrome Dev Tools
Open up the app, focus on the number input field, and press up or down keys to change its value.
Yep, it doesn't look good. Let's use the Chrome Dev tools to find out what's the root cause of the problem.

1. Open Chrome Dev Tools: right-click on the page and select `Inspect`. 

*WARNING: dev tools consume much more resources!*

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
1. Click the cog on the top right to open a panel.
1. Select `CPU: 6x slowdown`.
























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

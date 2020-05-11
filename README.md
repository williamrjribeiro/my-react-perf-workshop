# My React Perf Workshop

First things first: `yarn && yarn start`. You should see app working in the browser.

```
WARNING: This app can crash your browser and make your computer unresponsive!
```

As a huge simplification, in front-end web development there are 2 *key* performance indicators while running your user's
browser:
1. Time to interact: how does it take until your website loads and can user start using it? Load perf.
1. Fast and smooth: Are animations and updates fast enough while user interacts? Render perf.

Usually the former has a bigger impact in the overall perceived performance than the latter. React is a framework that
provides tools and functionalities for optimizing both aspects. Unfortunately due to time constraints, today we're going
to focus just on a few tricks to optimize rendering performance.  

The first step is to define our performance goal. Ideally you want your app re-rendering as close as 60FPS all the time.
Cinema movies render at 24FPS but that's not nearly good enough for today's interactive apps. Every second, your app must
update 60 times so every frame lasts only 16ms. This can be quite the challenge specially in low cost mobile phones.

The second step is identifying if we have a performance issue. Try pressing up or down keys to change the number input.
Yep, doesn't look good. Let's use the Chrome Dev tools to find out what's the root cause of the problem.

1. Open Chrome Dev Tools: right click on page and select `Inspect`. WARNING: dev tools consume much more resources!
1. Open the `Performance` tab.
1. Press `Esc` key to show bottom drawer.
1. Select the `Performance monitor` from the 3 vertical dots on the left.
1. Select the `Rendering` from the same menu. Turn on FPS and notice how Chrome saves our batteries!

These tools are great and provide tons of information, but it would be easier if we could see the FPS meter always at
60FPS and monitor the drops. For that we add a custom `<FPSMonitor>` component to the index.

The third step is running the app with production optimized code. Currently, we're running in dev mode (check terminal!). 
`yarn build && npx serve -s build`

After re-checking the perf with the production build we noticed that it's much faster but still slow. Let's look for the
root cause. In the `Performance` tab click the `Record` button, focus in the input, press key up/down, and stop recording.

Notice huge orange peak and the red bar above it. The former is `Scripting` and the latter indicates a frame took longer
than 16ms to update. Much longer!  

We can see that this function `e` is taking a lot of time to run. Select it and in the `Summary` tab we can click in its
source code. It's hard to find the match since the code has been heavily optimized. To simplify this workshop I left the 
`console.log` calls, but I know this is the problem. So if we remove it and re-measure we get completely different results.

Another good tip is that Chrome can do a virtual throttle the CPU:
1. Select `Performace` tab.
1. Click the cog on the top right to open a pannel.
1. Select `CPU: 6x slowdown`.

So even with super slow down, removing `console.log` get us the desired 60FPS! That's it, thank you for attending! 

Just kidding. Re-add the `console.log` so we can continue this workshop. 

The native tools are great but they are too low level. React has it's own that is designed to monitor React apps.
We need the [React Developer Tools Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).
Open `React's Profiler` tab. Err what?! `Profiling not supported.`. Yeah, React really really optimized itself for
production and removed all profiling code it has. In order to enable this we need to make a profile build which is just
a bit slower than a production build. Run the command:
`yarn build --profile && npx serve -s build`

Now `React's Profiler` is enabled so go ahead and record the number increment. Boom: Something fishy is going on with 
`<PrimeChecker>` component! 



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

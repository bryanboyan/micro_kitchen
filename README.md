# Micro kitchen system

## About

### UI
It's a plain command line based UI that shows slots on shelves and the order number on there.

```
┌────────────────┬──────┬──────┬──────┬──────┬──────┐
│ Shelf Name     │ @1   │ @2   │ @3   │ @4   │ @5   │
├────────────────┼──────┼──────┼──────┼──────┼──────┤
│ HotShelf       │ #31  │ #33  │ #38  │ #41  │
├────────────────┼──────┼──────┼──────┼──────┼──────┤
│ ColdShelf      │
├────────────────┼──────┼──────┼──────┼──────┼──────┤
│ FrozenShelf    │ #29  │ #32  │ #34  │ #35  │
├────────────────┼──────┼──────┼──────┼──────┼──────┤
│ OverflowShelf  │
└────────────────┴──────┴──────┴──────┴──────┴──────┘
```
In above example, each row is the shelf's ongoing orders. #<number> means order's number.
After every order is finished dispatching to driver (or wasted), the program will finish.

### Configurable
When launching, it will ask you questions to configure the run.

```
// This way you can update your poisson distribution rate when running
? Overwrite the poisson distribution rate? (default as 3.25) 100

// This is the way to clean up wasted orders
// - timeout strategy (option 3 below) means bottom up where the orders are managing their own expiration and remove themselves from shelf when expired
// - operate strategy (option 1 below) means top down where the ShelfOperator cleans up everytime it puts/picks orders
? Pick a cleanup strategy to do order cleanup (default: timeout) operate

// This is the way to choose the decay model
// - static means static decay model as shown in assignment
// - dynamic means some configurable models (right now based on temp)
? Choose strategy for order decay (default: static) static

// Just hit enter to start
? Ready to start?
```

Feel free to make different choices and run again.

## Main features
* Read from assets file for static orders
* Handle orders sequentially with Poisson Distribution rate
* For each order, call driver to fetch and instantly prepare the food and put onto targeted shelves
* Shelves have their own decay function and food need to be removed from shelf if their value reached zero
* Driver come at a random delay within 2~10 seconds
* Able to choose some options in the startup prompt
* Shows up right in command line about shelf and oder situations

## How to run and test

```
// Set up environment
// - Use latest node version and npm version

cd path/to/css_micro_kitchen/
npm install
npm run build

// Start the app
npm start

// Test the app
npm test
// See coverage
npm run coverage
```

## Handle moving orders to/from overflow shelf

### Component Structure
* OrderManager is to manage the incoming orders:
 * Simulates incoming orders with Poisson distribution
 * Dispatches driver which will pick orders when arriving
 * Uses ShelfOperator to put orders onto shelf
* ShelfOperator is a Facade class on top of shelves
 * Finds the right shelf to put and pick (based on temp)
 * Makes sure always clean up shelves before picking/putting orders
* Each type of shelf extends BaseShelf with similar shelf traits

### Performance of handling shelf cleaning
**Option 1**

Do cleanup every time we put or pick orders. This ensures that all orders are being evaluated whenever we operate on the shelves.

If we have total N orders in a short time, we will do O(N^2) checks which is intense if N grows exponentially.

**Option 2**

Set intervals to clean up periodically rather than doing whenever operating on shelves.

Let's say we clean up every 1 second, as we can imagine we likely have a lot more than 1 order in a second as we grow (not in this demo), so in short period of time, it will out perform O(N^2).

The issue with this is that it heavily rely on our shelf capacity. If we store too many wastes without cleaning up timely, fresher food will be wasted which is suboptimal.

**Option 3**

Orders clean up itself. In this scenario, each order will handle their own life and since it's deterministic when we get the order, it's easy to predict their end of life.

Obviously using setTimeout in node.js isn't scalable when it's distributed system. But as for the demo, this is still better performed than Option 1 since it'll be O(N) to handle cleanups.

**Migration**

I started with Option 1, but after finishing the initial deliverables and tests, I decided to refactor the relationship between Shelf and Order as in Option 3.

And in order to verify both, I updated the code to be able to handle two types of strategies of handling cleaning ups. as shown in above description.

I did experiment and found that with multiple Poisson distribution rate:

* 3.25 (default), operate used 44.5s and timeout used 45.2s
* 100, operate used 1.6s and timeout used 1.5
* 200, operate used 0.87s and timeout used 0.81s


## The Project

### Flow Type
I did adopt flow type in the whole system which made it so much better when the code grows a little bit.

The folder structure is like this.

```
├── README.md					// this file
├── app						// the main code folder with flowtyped.
├── app.js					// the app entry point
├── app_build					// the target folder after removing flowtyped
├── assets					// static data, including order.json
├── coverage					// test coverage folder
├── flow-typed				// for flow to install types for node_modules
├── index.js					// wraps app.js with esm which helps with es6
└── test						// folder for test code
```

### Tests

The current test coverage is 100% as shown below. I used jest to do testing to make sure when I do changes/migrations things are always right.

```
~/Projects/micro_kitchen(master ✗) npm run coverage

> css_micro_kitchen@0.0.1 coverage /Users/boyanlin/Projects/micro_kitchen
> jest --coverage

 PASS  test/order/OrderManager.test.js
 PASS  test/order/decay_strategies/MultiOrderDecayStrategies.test.js
 PASS  test/shelf/BaseShelf.test.js
 PASS  test/shelf/MultiShelves.test.js
 PASS  test/order/decay_strategies/OrderDecayStrategyFacade.test.js
 PASS  test/order/decay_strategies/BaseOrderDecayStrategy.test.js
 PASS  test/order/Order.test.js
 PASS  test/shelf/ShelfOperator.test.js
-------------------------------|----------|----------|----------|----------|-------------------|
File                           |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-------------------------------|----------|----------|----------|----------|-------------------|
All files                      |      100 |    96.67 |      100 |      100 |                   |
 order                         |      100 |    91.67 |      100 |      100 |                   |
  Order.js                     |      100 |      100 |      100 |      100 |                   |
  OrderManager.js              |      100 |    83.33 |      100 |      100 |                39 |
 order/decay_strategies        |      100 |      100 |      100 |      100 |                   |
  BaseOrderDecayStrategy.js    |      100 |      100 |      100 |      100 |                   |
  DefaultOrderDecayStrategy.js |      100 |      100 |      100 |      100 |                   |
  FrozenOrderDecayStrategy.js  |      100 |      100 |      100 |      100 |                   |
  HotOrderDecayStrategy.js     |      100 |      100 |      100 |      100 |                   |
  OrderDecayStrategyFacade.js  |      100 |      100 |      100 |      100 |                   |
 shelf                         |      100 |      100 |      100 |      100 |                   |
  BaseShelf.js                 |      100 |      100 |      100 |      100 |                   |
  MultiShelves.js              |      100 |      100 |      100 |      100 |                   |
  ShelfOperator.js             |      100 |      100 |      100 |      100 |                   |
-------------------------------|----------|----------|----------|----------|-------------------|
```
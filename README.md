# Micro kitchen system

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
npm coverage
```

### Options to start up

* cleanup strategy is about how you want to clean up shelves (also discussed more below)
  * timeout strategy is the option 3 below
  * operate strategy is the option 1 below
* poisson distrubition rate can also be configured, default is 3.25

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

And in order to verify both, I updated the code to be able to handle two types of strategies of handling cleaning ups.

* `STRATEGY='timeout' npm start` will run the timeout strategy where the orders are managing their own expiration and remove themselves from shelf when expired
* `STRATEGY='operate' npm start` will run the operate strategy where the ShelfOperator cleans up everytime it puts/picks orders

I did experiment and found that with multiple Poisson distribution rate:

* 3.25 (default), operate used 44.5s and timeout used 45.2s
* 100, operate used 1.6s and timeout used 1.5
* 200, operate used 0.87s and timeout used 0.81s
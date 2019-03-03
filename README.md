# Micro kitchen system

## Main features
* Read from assets file for static orders
* Handle orders sequentially with Poisson Distribution rate
* For each order, call driver to fetch and instantly prepare the food and put onto targeted shelves
* Shelves have their own decay function and food need to be removed from shelf if their value reached zero
* Driver come at a random delay within 2~10 seconds

## How to run and test
### Set up
* Use latest node version
* `cd path/to/css_micro_kitchen/ && npm install`

### Run the app
`cd path/to/css_micro_kitchen/ && node app`

### Test the app
```
> cd path/to/css_micro_kitchen/;
> npm test

// See coverage
> ./node_modules/jest/bin/jest.js --coverage
```

## Handle moving orders to/from overflow shelf

* Component Structure
  * OrderManager is to manage the incoming orders which simulates incoming orders with Poisson distribution, dispatching driver, and calling ShelfOperator to put orders onto shelf
  * ShelfOperator is a Facade class which takes care of underlying shelf modules, that it 
# Micro kitchen system

## Main features
* Read from assets file for static orders
* Handle orders sequentially with Poisson Distribution rate
* For each order, call driver to fetch and instantly prepare the food and put onto targeted shelves
* Shelves have their own decay function and food need to be removed from shelf if their value reached zero
* Driver come at a random delay within 2~10 seconds

## 
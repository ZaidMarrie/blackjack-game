# Blackjack Game

This is a simple blackjack game created with vanilla JavaScript. The game is from _scrimba's_ frontend developer path course.

## My Process

### Built with

- HTML
- CSS
- JavaScript

### What I learned

I learned and practiced the following concepts:

- Arrays
- Objects
- Booleans
- Conditional statements
- Comparison operators
- Logical operators
- For loops
- The Math object
- Return statements

```javascript
function getRandomCard() {
    let randomNumber = Math.floor( Math.random()*13 ) + 1
    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1) {
        return 11
    } else {
        return randomNumber
    }
}
```

## Contributing
Pull requests are very welcome and you may freely fork this repository.

## Supporting Scrimba

Since 2017, scrimba has created over 20 free courses and continue's launching free courses. If you perhaps are interested in learning or maybe just would like to up your skills try out their courses at [scrimba.com](www.scrimba.com).

- [Become a professional React developer](https://scrimba.com/course/greact)
- [The Responsive Web Design Bootcamp](https://scrimba.com/course/gresponsive)
- [The Ultimate JavaScript Bootcamp](https://scrimba.com/course/gjavascript)  

Happy Coding!

## License
[MIT](https://choosealicense.com/licenses/mit/)
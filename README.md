# Blackjack Game

A blackjack game built as part of **Scrimba.com**'s Frontend Career Path Course. This game I initially built similar to the game built within the course, until I learned about APIs. After learning about APIs I completely rebuilt the the game with the **deck-of-cards-api**

## My Process

### Built with

- HTML
- CSS
- JavaScript

### What I learned

I learned and practiced the following concepts:

- Arrays
- Objects
- Conditional statements
- Comparison operators
- Logical operators
- Fetch API
- Async/Await 

**A snippet of the code I used**
```javascript
async function createStartingCards(cardsArr, element) {
    cardsArr.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');

        const cardImg = document.createElement('img');
        cardImg.src = card.image;

        cardEl.appendChild(cardImg);
        element.appendChild(cardEl);
    });   
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
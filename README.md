# Tip
*Tip* is a highly-customizable, yet simple object for providing hints in single-page web apps.



## Features

1.  **Lite:** *Tip* is standalone with a total size of `< 6KB` (non-minified and non-gzipped).

2.  **Highly-customizable:** You can customize a lot of special behaviors of *Tip* directly through CSS (refer to [Styling guide](#styling-guide)).

3.  **Interactive:** *Tip* was made to be convenient with user interaction:
    
    1. When the mouse poiner is moved over the tip, the timer will stop and the tip will be visible until the pointer is moved away. This is helpful in cases like when the user wants more time to read the tip.
    
    2. You can set a message to be displayed to the user whenever the tip is clicked, in case they're wondering what this is about.



## Installation

You can use it in one of two ways:

1. Add `script.js` and `style.css` in your HTML, e.g.:

   ````html
   <link rel="stylesheet" href="tip/style.css"/>
   <script src="tip/script.js"></script>
   ````
   
2. Or you can just add `script.js` and `style.css` to your project tree and then `require()` it as a module (e.g. `CommonJS`, `AMD`).

The `style.css` file only contains barebones necessary styling. So you *must* add another file with your styling, using the [Styling guide](#styling-guide) section below.


## Usage

Create an object in your script, then use [`Tip.echo()`](#tipprototypeechotext-mode-animateinagain) to send messages to the user:

````js
var tip = new Tip();
tip.echo('Hello!');
````



## Reference


### `Tip([options])`

The constructor.

* `options` (`Object`): An optional argument to customize the following:

    1.  `options.id` (`String`): The ID of the element to be created. Use this option in case the default ID is already used in your project.
    
        *Default value:* `"tip"`.
        
        ***Warning:*** If you change the element ID, make sure to change it in the CSS file too.

    2.  `options.delay` (`Number`): Amount of time *Tip* will be displayed to the user everytime [`Tip.echo()`](#tipprototypeechotext-mode-animateinagain) is called, in milliseconds.
    
        *Default value:* `350`.

    3.  `options.onClickMessage` (`String`): A message that will be displayed to the user when they click on the tip.
        Unless `options.onClickMessage` is set, no on-click listeners will be registered on the tip.
        
        *Default value:* `""`.

````js
var tip = new Tip({
  id: 'user-tips',
  delay: '1000',
  onClickMessage: 'Tip is here to help you.'
});
````


### `Tip.prototype.echo(text, [mode], [animateInAgain])`

The main method. Shows a new tip to the user, and overrides the previous tip if any.

* `text` (`String`): The text to be displayed to the user.

* `mode` (`any`): Setting a mode, or "category" to the current message. Useful when later-checking the *Tip* when it's visible.
    
    *Default value:* `null`.

* `animateInAgain` (`Boolean`): A switch that indicates whether to assign the `in-move` class with the current message. Useful when you want to update the current message *and* reset the timer (unlike [`Tip.updateText()`](#tipprototypeupdatetexttext)).

    *Default value:* `true`.

````js
const WELCOME = 10;
tip.echo('Hi, user.', WELCOME);
````


### `Tip.prototype.forceHide()`

Force *Tip* to hide even if the timer isn't over yet.



### `Tip.prototype.updateText(text)`

Updates the tip text without renewing the timer. Works best with [`Tip.isVisible()`](#getters) and [`Tip.getMode()`](#getters), for regularly updating very time-sensitive data while the tip is visible to the user. Only works when the tip is visible.

* `text` (`String`): The new text to be displayed to the user.


### Getters

1.  `Tip.prototype.getText()`: Get the current message being displayed, if any.
2.  `Tip.prototype.getMode()`: Get the mode of the current message being displayed, if any.
3.  `Tip.prototype.isVisible()`: Check if the tip is currently visible *or animating to hide*.
4.  `Tip.prototype.isHiddenOrKilled()`: Check if the tip is currently hidden *or animating to hide*.

***Note*** that `tip.isVisible()` can be equal to `tip.isHiddenOrKilled()` at a given moment. This is intended to allow more customization. If you want to check if the tip is specifically `killed` (completely hidden to the user), you can use `!tip.isVisible()`. You can safely ignore `tip.isHiddenOrKilled()` unless you have a reason to use it.



## Styling guide

*Tip* currently supports customizing the following behaviors as CSS classes:
    
1.  `shown`: Indicates that a new message was just sent to the user, and *Tip* should be visible now. The CSS property `opacity` is used here. You can use anything, from a simple `opacity` transition to a complex animation, e.g.:

    ```css
    #tip.shown {
      transition: opacity 1.0s ease;
    }
    ```
    
2.  `hidden`: Indicates that the message timer has ended, and *Tip* should now be hidden. Like `shown`, the CSS property `opacity` is used here. You can also use anything here. You can combine both `shown` and `hidden` with one effect, e.g.:

    ```css
    #tip.shown,
    #tip.hidden {
      transition: opacity 1.0s ease;
    }
    ```

3.  `in-move`: Indicates that *Tip* is now adjusting its position to center itself horizontally on the screen. The CSS property `left` is used here, so you can use a simple transition to animate the movement, e.g.:

    ```css
    #tip.in-move {
      transition: left 0.25s ease;
    }
    ```
    
4.  `in-again`: Indicates that the message sent to the tip through [`Tip.echo()`](#tipprototypeechotext-mode-animateinagain) is the same message currently displayed. This is very useful for drawing the user's attention after, say, doing the same action and expecting a different result. You can add a simple animation here, e.g.:

    ```css
    #tip.in-again {
      animation: shake 1.0s ease;
    }
    ```

***Tip:*** Visit [Animate.css](https://daneden.github.io/animate.css/) for great animation ideas.

***Note:*** *Tip* has the class `killed` after it finishes animating in its `hidden` state, so it's completely not visible. The styling for `killed` is included in the barebones stylesheet, and I recommend not styling it any further.



## Contributing

Issues and pull requests are always welcome.



## License

&copy; Copyright 2017 Hazem AbuMostafa.

This project is subject to the [Apache License, Version 2.0](http://apache.org/licenses/LICENSE-2.0.html).

# Tip
*Tip* is a highly-customizable, yet simple object for providing hints in single-page web apps.



## Features

1.  **Lite:** *Tip* is standalone with a total size of `< 6KB` (non-minified and non-gzipped).

2.  **Highly-customizable:** You can customize a lot of special behaviors of *Tip* directly through CSS.



## Installation

Add `script.js` and `style.css` in your HTML, e.g.:

````html
<link rel="stylesheet" href="tip/style.css"/>
<script src="tip/script.js"></script>
````

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

1.  `Tip.prototype.getText()`
2.  `Tip.prototype.getMode()`
3.  `Tip.prototype.isVisible()`
4.  `Tip.prototype.isHiddenOrKilled()`



## Styling guide

*Tip* currently supports customizing the following behaviors as CSS classes:
    
1.  `shown`: Indicates that a new message was just sent to the user, and *Tip* should be visible now. You can use anything here, from a simple `opacity` transition to a complex animation, e.g.:

    ```css
    #tip.shown {
      transition: opacity 1.0s ease;
    }
    ```
    
2.  `hidden`: Indicates that the message timer has ended, and *Tip* should now be hidden. Again, you can use anything here. You can also combine both `shown` and `hidden` with one effect, e.g.:

    ```css
    #tip.shown,
    #tip.hidden {
      transition: opacity 1.0s ease;
    }
    ```

3.  `in-move`: This class indicaes that *Tip* is now adjusting its position to center itself horizontally on the screen. The CSS propery `left` is used here, so you can use a simple transition to animate the movement, e.g.:

    ```css
    #tip.in-move {
      transition: left 0.25s ease;
    }
    ```
    
4.  `in-again`: The message sent to the tip through `Tip.echo()` is the same message currently displayed. This is very useful for drawing the user's attention after, say, doing the same wrong action and expecting a result. You can add a simple animation here, e.g.:

    ```css
    #tip.in-again {
      animation: shake 1.0s ease;
    }
    ```

***Tip:*** Visit [Animate.css](https://daneden.github.io/animate.css/) for great animation ideas.

***Note:*** *Tip* has the class `killed` after it finishes animating in its `hidden` state, so it's completely not visible. The styling for `killed` is included in the barebones stylesheet, and I recomment not styling it any further.



## Contributing

Issues and pull requests are always welcome.



## License

&copy; Copyright 2017 Hazem AbuMostafa.

This project is subject to the [Apache License, Version 2.0](http://apache.org/licenses/LICENSE-2.0.html).

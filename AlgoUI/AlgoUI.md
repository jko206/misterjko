AlgoUI 

# Intro

There had to be a better way to show off your algorithm for others

# Usage

```javascript
let algo1 = new AlgoUI({
  algo: 'path/to/some/algorithm.js',
  desc: 'description of what the algorithm is supposed to do',
  samples: [
    // ...
    // list of sample inputs
  ],
  arguments : [
    // order matters
    {
      name: 'k',
      desc: 'some description of what k is.',
      type: 'Integer'
    },
    {
      name: 'Str',
      desc: 'some description of what Str is.',
      type: 'String'
    },
    {
      name: 'arr',
      desc: 'some description of what arr is.',
      type: 'Array<Number>'
    },
  ],
  adt: // abstract data type, like tree, heap, or some other crap
});
```

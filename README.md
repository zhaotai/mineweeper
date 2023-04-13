## Available Scripts

In the project directory, you can run:

### `npm i`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Critical Performance Considerations

The whole design is using 2 `string[][]` to represent the game board.

So one issue is everytime you update one cell, you need to generate a new board to trigger rerender.

I do in-place update and `board = [...board]` to just creat new reference.

Another bottleneck is auto expanding empty cells.
- Using BFS can be optimal, complexity = `O(m * n)`;
- Using `visited[][]` and update it right after pushing into queue instead of after pop can significantly improve the performance.

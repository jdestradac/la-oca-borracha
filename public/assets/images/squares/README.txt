Drop your board square images in this folder using this exact naming convention:

  square-start.png    -> the START square (position 0)
  square-1.png ... square-46.png  -> the 46 numbered squares
  square-winner.png   -> the WINNER square (position 47)

You can use .png or .jpg for any square — the board tries both extensions
automatically, so you don't need to change any code, and you can even mix
formats across squares.

If a file is missing, the board falls back to a plain colored tile showing
the square's number/label, so the game stays playable without any images.

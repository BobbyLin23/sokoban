import type { Difficulty, Level } from './types'

export const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard']

export const levelPacks: Record<Difficulty, Level[]> = {
  easy: [
    {
      id: 'first-push',
      name: 'First Push',
      rows: ['########', '#  .   #', '#  $   #', '#  @   #', '#      #', '########'],
    },
    {
      id: 'corner-room',
      name: 'Corner Room',
      rows: ['#########', '#   #   #', '# .$@$. #', '#   #   #', '#       #', '#########'],
    },
    {
      id: 'warehouse',
      name: 'Warehouse',
      rows: ['##########', '#   ..   #', '#  $$#   #', '#   @#   #', '#        #', '##########'],
    },
    {
      id: 'narrow-lane',
      name: 'Narrow Lane',
      rows: ['###########', '#    #    #', '# .$ $ .  #', '#    @    #', '#         #', '###########'],
    },
    {
      id: 'split-dock',
      name: 'Split Dock',
      rows: ['##########', '#   .    #', '#   $    #', '# @ #    #', '#   . $  #', '#        #', '##########'],
    },
    {
      id: 'two-step',
      name: 'Two Step',
      rows: ['#########', '# . .   #', '# $ $   #', '#   @   #', '#       #', '#########'],
    },
  ],
  medium: [
    {
      id: 'side-yard',
      name: 'Side Yard',
      rows: ['############', '#   #      #', '# . $  .   #', '# . $  $ @ #', '#          #', '############'],
    },
    {
      id: 'quiet-hall',
      name: 'Quiet Hall',
      rows: ['############', '#   . . .  #', '#   $ $ $  #', '#     @    #', '#          #', '############'],
    },
    {
      id: 'north-wall',
      name: 'North Wall',
      rows: ['############', '# .. .     #', '# $$ $     #', '#  @       #', '#          #', '############'],
    },
    {
      id: 'long-room',
      name: 'Long Room',
      rows: ['#############', '#   .  . .  #', '#   $  $ $  #', '#     @     #', '#           #', '#############'],
    },
    {
      id: 'center-pair',
      name: 'Center Pair',
      rows: ['############', '#    . .   #', '#    $ $   #', '#  . $ @   #', '#          #', '############'],
    },
    {
      id: 'lower-bay',
      name: 'Lower Bay',
      rows: ['############', '#          #', '#  @ $$$   #', '#     ...  #', '#          #', '############'],
    },
    {
      id: 'open-shop',
      name: 'Open Shop',
      rows: ['############', '#  .   . . #', '#  $   $ $ #', '#    @     #', '#          #', '############'],
    },
  ],
  hard: [
    {
      id: 'pillar-room',
      name: 'Pillar Room',
      rows: ['#############', '#   . . .   #', '#   $#$ $   #', '#    @      #', '#           #', '#############'],
    },
    {
      id: 'right-shift',
      name: 'Right Shift',
      rows: ['#############', '#      ...  #', '#     $$$   #', '#   @   #   #', '#           #', '#############'],
    },
    {
      id: 'left-shift',
      name: 'Left Shift',
      rows: ['#############', '#  ...      #', '#   $$$     #', '#   #   @   #', '#           #', '#############'],
    },
    {
      id: 'three-boxes',
      name: 'Three Boxes',
      rows: ['#############', '#   . . .   #', '#   $ $ $   #', '#   # @ #   #', '#           #', '#############'],
    },
    {
      id: 'staggered',
      name: 'Staggered',
      rows: ['#############', '#   .       #', '#   $  .    #', '# @    $    #', '#      . $  #', '#           #', '#############'],
    },
    {
      id: 'storage-lane',
      name: 'Storage Lane',
      rows: ['#############', '# . . . .   #', '# $ $ $ $ @ #', '#     #     #', '#           #', '#############'],
    },
    {
      id: 'inner-wall',
      name: 'Inner Wall',
      rows: ['#############', '#   ...     #', '#   $$$ #   #', '#   @   #   #', '#           #', '#############'],
    },
  ],
}

export const levels: Level[] = difficultyOptions.flatMap((difficulty) => levelPacks[difficulty])

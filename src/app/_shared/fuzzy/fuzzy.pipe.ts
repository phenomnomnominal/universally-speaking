import { Pipe, PipeTransform } from '@angular/core';

const FUZZES = [{
  word: 'trillion',
  num: 1000000000000
}, {
  word: 'billion',
  num: 1000000000
}, {
  word: 'million',
  num: 1000000
}, {
  word: 'thousand',
  num: 1000
}];

@Pipe({
  name: 'fuzzy'
})
export class FuzzyPipe implements PipeTransform {
  public transform (n: number): string {
    if (n < 0.1) {
        return '0';
    }
    for (let i = 0; i < FUZZES.length; i += 1) {
      const { num, word } = FUZZES[i];
      if (n / num >= 1) {
        const prefix = (n / num);
        if (i === 0 && prefix > 100) {
          return `> 100 ${word}`;
        }
        return `${prefix.toFixed(2)} ${word}`;
      }
    }
    return `${n}`;
  }
}

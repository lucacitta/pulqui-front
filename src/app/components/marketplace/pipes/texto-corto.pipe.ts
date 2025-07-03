import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textoCorto',
})
export class TextoCortoPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    limit: boolean | number = 100
  ): string | null {
    if (value == null) {
      return null;
    }

    if (typeof limit === 'boolean') {
      return limit ? value : value.slice(0, 100) + '...';
    }

    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}

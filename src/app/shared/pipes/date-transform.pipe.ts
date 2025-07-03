import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTransform',
  standalone: true
})
export class DateTransformPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let year = value.substring(0,4)
    let day = value.substring(8,10)
    let month = parseInt(value.substring(5,7)) -1;
    let dateFinish = new Date(year, month, day);
    let formattedDay = dateFinish.getDate();
    let formattedMonth = dateFinish.getMonth() + 1; // Sumamos 1 porque los meses empiezan en 0
    let formattedYear = dateFinish.getFullYear();
    let dateFinal = `${formattedDay}/${formattedMonth}/${formattedYear}`
    return dateFinal;
  
    
  }

}

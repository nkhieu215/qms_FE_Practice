import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterErrors'
})
export class FilterErrorsPipe implements PipeTransform {
    transform(errors: any[]): any[] {
        if (!errors) return [];
        return errors.filter(error => error.value > 0);
    }
}
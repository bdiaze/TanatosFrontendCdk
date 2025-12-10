import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatearTelefono',
})
export class FormatearTelefonoPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '';

        const digitos = value.replace(/\D+/g, '');

        if (digitos.length === 0) return '';

        let formatted = '';
        if (digitos.length > 0) {
            formatted = '+' + digitos.substring(0, 2);
        }
        if (digitos.length > 2) {
            formatted += ' ' + digitos.substring(2, 3);
        }
        if (digitos.length > 3) {
            formatted += ' ' + digitos.substring(3, 7);
        }
        if (digitos.length > 7) {
            formatted += ' ' + digitos.substring(7, 11);
        }
        if (digitos.length > 11) {
            formatted += ' ' + digitos.substring(11);
        }

        return formatted;
    }
}

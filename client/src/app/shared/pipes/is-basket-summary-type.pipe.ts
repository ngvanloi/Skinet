import { Pipe, PipeTransform } from '@angular/core';
import { IOrderItem } from '../models/order';
import { IBasketItem } from '../models/basket-item';

@Pipe({
    name: 'isBasketSummaryType',
})
export class IsBasketSummaryTypeInterfacePipe implements PipeTransform {
    transform(value: IOrderItem | IBasketItem, expect: 'a'): false | IOrderItem;
    transform(value: IOrderItem | IBasketItem, expect: 'b'): false | IBasketItem;
    transform(
        value: IOrderItem | IBasketItem,
        expect: 'a' | 'b'
    ): false | IOrderItem | IBasketItem {
        if (expect === 'a' && !!(value as IOrderItem).productId) return value;
        if (expect === 'b' && !!(value as IBasketItem).id) return value;
        if (expect === 'b' && !!(value as IBasketItem).type) return value;
        if (expect === 'b' && !!(value as IBasketItem).brand) return value;
        return false;
    }
}
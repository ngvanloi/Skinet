import { IProduct } from "./product-return-to.dto.model";

export interface IPagination {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[];
}

export class Pagination implements IPagination {
    pageIndex: number = 0;
    pageSize: number = 0;
    count: number = 0;
    data: IProduct[] = [];
}
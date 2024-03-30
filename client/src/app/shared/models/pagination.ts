import { IProduct } from "./product-return-to.dto.model";

export interface IPagination {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[];
}
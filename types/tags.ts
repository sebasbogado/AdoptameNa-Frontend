import { string } from "zod";
import { PostType } from "./post-type";

export interface Tags{
    id: number;
    name: string;
    postTypeId: number;
}
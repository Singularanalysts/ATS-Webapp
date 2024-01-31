import { CommonError } from './common-error';

export class HandledError extends CommonError{
    constructor(message: string){
        super(message);
    }
}

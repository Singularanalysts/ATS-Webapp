import { CommonError } from './common-error';

export class UnHandledError extends CommonError{
    constructor(message: string){
        super(message);
    }
}

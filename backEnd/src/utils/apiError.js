class apiError extends Error{
    constructor(
        statusCode,
        message="somethis went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode,
        this.message=message,
        this.success="false"
        this.errors = errors

        if(stack){
            this.stack = stack;
        }
        {
            Error.captureStackTrace(this, this.constructor)
        }
    }
    toJSON(){
    return{
        statusCode:this.statusCode,
        success:this.success,
        message:this.message,
        errors:this.errors
    }
}


}

export default apiError;
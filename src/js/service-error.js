glDashboard.service('error', function() {
        
        this.createError = function(err) {

            var error = {
                status: "",
                message: "",
                details: "",
                inner: null
            };

            error.inner = err;

            if (err instanceof Error) {

                error.status = "An error has occured";
                error.message = err.message;
                error.details = err.stack;
            }

            //$http errors
            else if (err.hasOwnProperty("statusText") && err.hasOwnProperty("data") && err.hasOwnProperty("data")) {

                if (null != err.data) {
                    error.status = err.statusText;
                    error.message = err.data.message;
                    error.details = JSON.stringify(err.data);
                } else {
                    error.status = "HTTP error - see trace for details"
                    error.message = "An error has occured";
                    error.details = JSON.stringify(err.config);
                }

            } else {
                error.details = err;
            }

            return error;
        };


    });

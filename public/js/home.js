(function(document, $) {
    function SignIn(form) {
        this.form = form;
        this.email = form.find('#email');
        this.password = form.find('#password');
        this.validate();
    }

    SignIn.prototype = {

        validate: function() {
            var self = this;
            this.form.on('submit', function(event) {
                if (self.email.val().match("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}")) {
                    document.getElementById('email-err').style.display = "none";
                    if (self.password.val().length >= 6) {
                        document.getElementById('pwd-err').style.display = "none";
                    } else {
                        document.getElementById('pwd-err').style.display = "block";
                        event.preventDefault();
                    }

                } else {
                    event.preventDefault();
                    console.log('else')
                    document.getElementById('email-err').style.display = "block";
                }
            });
        }
    }


    function SignUp(form) {
        this.form = form;
        this.retypePwd = form.find('#retype-pwd');
        this.email = form.find('#email');
        this.password = form.find('#password');
        this.validate();
    }

    SignUp.prototype = {

        validate: function() {
            console.log(this);
            var self = this;
            this.form.on('submit', function(event) {
                if (self.email.val().match("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}")) {
                    console.log('email ok');
                    self.form.find('#email-err').css('display', 'none');
                    if (self.password.val().length >= 6) {
                        self.form.find('#pwd-err').css('display', 'none');
                        if (self.retypePwd.val() === self.password.val()) {
                            self.form.find('#repwd-err').css('display', 'none');

                        } else {
                            self.form.find('#repwd-err').css('display', 'block');
                            event.preventDefault();
                        }

                    } else {
                        self.form.find('#pwd-err').css('display', 'block');
                        event.preventDefault();
                    }

                } else {
                    event.preventDefault();
                    console.log('else')
                    self.form.find('#email-err').css('display', 'block');
                }
            });
        }

    }



    new SignIn($('#signin'));

    new SignUp($('#signup'));


    function changeHead(signin, signup, inBox, upBox) {
        console.log(inBox, upBox);
        signin.on('click', function() {

            signup.removeClass('active');
            signin.addClass('active');
            inBox.css('display', 'block');
            upBox.css('display', 'none');
        });

        signup.on('click', function() {
            signin.removeClass('active');
            signup.addClass('active');
            inBox.css('display', 'none');
            upBox.css('display', 'block');
        });

    }

    changeHead($('#signin-head'), $('#signup-head'), $('#signin-box'), $('#signup-box'));


})(this.document, this.$);
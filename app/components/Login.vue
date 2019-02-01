<script>
  import Home from './Home'
  var LoadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;

  var loader = new LoadingIndicator();
  var validator = require("email-validator");

  export default {
    data() {
      return {
        isLoggingIn: true,
        user: {
          email: '',
          password: '',
          confirmPassword: '',
        }
      };
    },
    methods: {
      toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
      },
      submit() {
        if (!this.user.email || !this.user.password) {
          this.alert("Please provide both an email address and password.");
          return;
        }
        loader.show();
        if (this.isLoggingIn) {
          this.login();
        } else {
          this.register();
        }
      },
      login() {
        this.$firebase.login({
          type: this.$firebase.LoginType.PASSWORD,
          passwordOptions: {
            email: this.user.email,
            password: this.user.password
          }
        })
        .then(() => {
          loader.hide();
          this.$navigateTo(Home);
        })
        .catch(() => {
          loader.hide();
          this.alert("Unfortunately we could not find your account.");
        });
      },
      register() {
        if (!validator.validate(this.user.email)) {
          loader.hide();
          this.alert("Please enter a valid email address.");
          return;
        }

        if (this.user.password != this.user.confirmPassword) {
          loader.hide();
          this.alert("Your passwords do not match.");
          return;
        }

        if (this.user.password.length < 6) {
          loader.hide();
  		    this.alert("Your password must at least 6 characters.");
          return;
        }

        this.$firebase.createUser({
          email: this.user.email,
          password: this.user.password
        })
        .then(() => {
          loader.hide();
          this.alert("Your account was successfully created.");
          this.isLoggingIn = true;
        })
        .catch(() => {
          loader.hide();
          this.alert("Unfortunately we were unable to create your account.");
        });
      },
      forgotPassword() {
        prompt({
          title: "Forgot Password",
          message:
            "Enter the email address you used to register for APP NAME to reset your password.",
          inputType: "email",
          defaultText: "",
          okButtonText: "Ok",
          cancelButtonText: "Cancel"
        }).then(data => {
          if (data.result) {
            loader.show();
            this.$firebase.resetPassword({
              email: data.text.trim()
            })
            .then(() => {
              loader.hide();
              this.alert(
                "Your password was successfully reset. Please check your email for instructions on choosing a new password."
              );
            })
            .catch(() => {
              loader.hide();
              this.alert(
                "Unfortunately, an error occurred resetting your password."
              );
            });
          }
        });
      },
      focusPassword() {
        this.$refs.password.nativeView.focus();
      },
      focusConfirmPassword() {
        if (!this.isLoggingIn) {
          this.$refs.confirmPassword.nativeView.focus();
        }
      },
      alert(message) {
        return alert({
          okButtonText: "OK",
          message: message
        });
      }
    }
  };
</script>

<template>
	<Page class="page">
    <ActionBar class="action-bar">
      <GridLayout width="100%" columns="10, *">
        <Label class="title" text="Login"  col="1"/>
      </GridLayout>
    </ActionBar>

		<FlexboxLayout flexDirection="column" alignItems="center" justifyContent="space-between">
			<StackLayout class="login-form" width="100%">
				<Image class="logo" src="~/images/logo.png" />

				<StackLayout class="input-field" marginBottom="25">
					<TextField
            class="input"
            hint="Email"
            keyboardType="email"
            autocorrect="false"
            autocapitalizationType="none"
            v-model="user.email"
  					returnKeyType="next"
            @returnPress="focusPassword"
          />
					<StackLayout class="hr-light" />
				</StackLayout>

				<StackLayout class="input-field" marginBottom="25">
					<TextField
            ref="password"
            class="input"
            hint="Password"
            secure="true"
            v-model="user.password"
            :returnKeyType="isLoggingIn ? 'done' : 'next'"
  					@returnPress="focusConfirmPassword"
          />
				</StackLayout>

				<StackLayout v-show="!isLoggingIn" class="input-field" marginBottom="25">
					<TextField
            ref="confirmPassword"
            class="input"
            hint="Confirm password"
            secure="true"
            v-model="user.confirmPassword"
            returnKeyType="done"
					/>
				</StackLayout>

				<Button :text="isLoggingIn ? 'Log In' : 'Sign Up'" @tap="submit" class="btn btn-primary m-t-20" />

        <FlexboxLayout marginTop="30" justifyContent="center">
          <Label v-show="isLoggingIn" text="Forgot your password?" class="login-label" @tap="forgotPassword" />
        </FlexboxLayout>
			</StackLayout>

      <StackLayout padding="30">
        <Label class="login-label" @tap="toggleForm">
          <FormattedString>
            <Span :text="isLoggingIn ? 'Don’t have an account? ' : 'Back to Login'" />
            <Span :text="isLoggingIn ? 'Sign up' : ''" />
          </FormattedString>
        </Label>
      </StackLayout>
		</FlexboxLayout>
	</Page>
</template>

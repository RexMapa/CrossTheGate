
(function($){
  $.fn.extend({
      donetyping: function(callback,timeout){
          timeout = timeout || 500;
          var timeoutReference,
              doneTyping = function(el){
                  if (!timeoutReference) return;
                  timeoutReference = null;
                  callback.call(el);
              };
          return this.each(function(i,el){
              var $el = $(el);
              $el.is(':input') && $el.on('keyup keypress',function(e){
                  if (e.type=='keyup' && e.keyCode!=8) return;
                  if (timeoutReference) clearTimeout(timeoutReference);
                  timeoutReference = setTimeout(function(){
                      doneTyping(el);
                  }, timeout);
              }).on('blur',function(){
                  doneTyping(el);
              });
          });
      }
  });
})(jQuery);

formValidation = {
init: function(){
  this.$form = $('.registration-form');
  this.$firstName = this.$form.find('input[name="firstName"]');
  this.$nationality = this.$form.find('input[name="nationality"]');
  this.$maritalStatus = this.$form.find('input[name="maritalStatus"]');
  this.$mobileNumber = this.$form.find('input[name="mobileNumber"]');
  this.$countryApplying = this.$form.find('input[name="countryApplying"]');
  this.$countryCode = this.$form.find('input[name="countryCode"]');
  this.$lastName = this.$form.find('input[name="lastName"]');
  this.$email = this.$form.find('input[name="email"]');
  this.$password = this.$form.find('input[name="password"]');
  this.$passwordToggle = this.$form.find('button.toggle-visibility');
  this.$submitButton = this.$form.find('button.submit');
  
  this.validatedFields = {
    firstName: false,
    nationality: false,
    maritalStatus: false,
    countryApplying: false,
    countryCode: false,
    mobileNumber: false,
    lastName: false,
    email: false,
    password: false
  };
  
  this.bindEvents();
},
bindEvents: function(){
  this.$firstName.donetyping(this.validateFirstNameHandler.bind(this));
  this.$nationality.donetyping(this.validateNationalityHandler.bind(this));
  this.$maritalStatus.donetyping(this.validateMaritalStatusHandler.bind(this));
  this.$countryCode.donetyping(this.validateCountryCodeHandler.bind(this));
  this.$mobileNumber.donetyping(this.validateMobileNumberHandler.bind(this));
  this.$countryApplying.donetyping(this.validateCountryApplyingHandler.bind(this));
  this.$lastName.donetyping(this.validateLastNameHandler.bind(this));
  this.$email.donetyping(this.validateEmailHandler.bind(this));
  this.$password.donetyping(this.validatePasswordHandler.bind(this));
  this.$passwordToggle.mousedown(this.togglePasswordVisibilityHandler.bind(this));
  this.$passwordToggle.click(function(e){e.preventDefault()});
  this.$form.submit(this.submitFormHandler.bind(this));
},
validateFirstNameHandler: function(){
  this.validatedFields.firstName = this.validateText(this.$firstName);
},
validateNationalityHandler: function(){
  this.validatedFields.nationality = this.validateText(this.$nationality);
},
validateMaritalStatusHandler: function(){
  this.validatedFields.maritalStatus = this.validateText(this.$maritalStatus);
},
validateCountryCodeHandler: function(){
  this.validatedFields.countryCode = this.validateText(this.$countryCode);
},
validateMobileNumberHandler: function(){
  this.validatedFields.mobileNumber = this.validateText(this.$mobileNumber);
},
validateCountryApplyingHandler: function(){
  this.validatedFields.countryApplying = this.validateText(this.$countryApplying);
},
validateLastNameHandler: function(){
  this.validatedFields.lastName = this.validateText(this.$lastName);
},
validateEmailHandler: function(){
  this.validatedFields.email = this.validateText(this.$email) && this.validateEmail(this.$email);
},
validatePasswordHandler: function(){
  this.validatedFields.password = this.validateText(this.$password) && this.validatePassword(this.$password);
},
togglePasswordVisibilityHandler: function(){
  var html = '<input type="text" value="'+this.$password.val()+'">';
  var $passwordParent = this.$password.parent()
  var saved$password = this.$password.detach();
  $passwordParent.append(html);
  this.$passwordToggle.find('span').removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
  this.$passwordToggle.one('mouseup mouseleave', (function(){
    $passwordParent.find('input').remove();
    $passwordParent.append(saved$password);
    this.$passwordToggle.find('span').removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
  }).bind(this));
},
submitFormHandler: function(e){
  e.preventDefault();
  this.validateFirstNameHandler();
  this.validateNationalityHandler();
  this.validateMaritalStatusHandler();
  this.validateCountryCodeHandler();
  this.validateMobileNumberHandler();
  this.validateCountryApplyingHandler();
  this.validateLastNameHandler();
  this.validateEmailHandler();
  this.validatePasswordHandler();
  if(this.validatedFields.firstName && this.validatedFields.nationality && this.validatedFields.maritalStatus && this.validatedFields.countryCode  && this.validatedFields.mobileNumber && this.validatedFields.countryApplying &&  this.validatedFields.lastName && this.validatedFields.email && this.validatedFields.password){
    this.$submitButton.addClass('loading').html('<span class="loading-spinner"></span>')
    setTimeout((function(){
      this.$submitButton.removeClass('loading').addClass('success').html('Welcome, '+this.$firstName.val())
    }).bind(this), 1500);
  }else{
    this.$submitButton.text('Please Fix the Errors');
    setTimeout((function(){
      if(this.$submitButton.text() == 'Please Fix the Errors'){
        this.$submitButton.text('Submit');
      }
    }).bind(this), 3000)
  }
},

validateText: function($input){
  $input.parent().removeClass('invalid');
  $input.parent().find('span.label-text small.error').remove();
  if($input.val() != ''){
    return true;
  }else{
    $input.parent().addClass('invalid');
    $input.parent().find('span.label-text').append(' <small class="error">(Field is empty)</small>');
    return false;
  }
},
validateEmail: function($input){
  var regEx = /\S+@\S+\.\S+/;
  $input.parent().removeClass('invalid');
  $input.parent().find('span.label-text small.error').remove();
  if(regEx.test($input.val())){
    return true;
  }else{
    $input.parent().addClass('invalid');
    $input.parent().find('span.label-text').append(' <small class="error">(Email is invalid)</small>');
    return false;
  }
},
validatePassword: function($input){
    $input.parent().removeClass('invalid');
  $input.parent().find('span.label-text small.error').remove();
  if($input.val().length >= 8){
    return true;
  }else{
    $input.parent().addClass('invalid');
    $input.parent().find('span.label-text').append(' <small class="error">(Your password must longer than 7 characters)</small>');
    return false;
  }
}
}.init();

Email.send({
  SecureToken : "C973D7AD-F097-4B95-91F4-40ABC5567812",
  To : 'them@website.com',
  From : "you@isp.com",
  Subject : "This is the subject",
  Body : "And this is the body"
}).then(
message => alert(message)
);

const $btnsubmit = document.getElementById('submitbtn');
$btnsubmit.addEventListener('click',function(){
    console.log('hi');
})


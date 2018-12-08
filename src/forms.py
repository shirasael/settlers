from wtforms import Form, BooleanField, StringField, PasswordField, IntegerField, validators

class RegistrationForm(Form):	
  yefes_id = IntegerField('yefes_id', [validators.Length(min=4, max=25)])
  email = StringField('Email Address', [validators.Length(min=6, max=35)])
  password = PasswordField('New Password', [
      validators.DataRequired(),
      validators.EqualTo('confirm', message='Passwords must match')
  ])
  confirm = PasswordField('Repeat Password')
  accept_tos = BooleanField('I accept the TOS', [validators.DataRequired()])
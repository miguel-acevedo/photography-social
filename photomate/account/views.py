from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect

# https://simpleisbetterthancomplex.com/tutorial/2017/02/18/how-to-create-user-sign-up-view.html

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            #form.save()
            # The reason this works is because I am using UserCreatonForm and django already understands the inputs.
            #username = form.cleaned_data.get('useranme')
            #raw_password = form.cleaned_data.get('password1')
            #user = authenticate(username=username, password=raw_password)
            user = form.save()
            #login(request, user)
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return redirect('/view')
    else:
        form = UserCreationForm()
    return render(request, 'account/signup.html', { 'form': form })
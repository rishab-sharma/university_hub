# University Hub

Author: Rishab Sharma - MAIT , New Delhi

University Hub is an App to connect the administration and the students through a simplified webapp . The Schema currently includes three different sections including the announcements section , the general discussion section and the semester forum .
The Announcements
The Announcement section include the official announcements from the university side and only has the write permission from the university side. The announcements section have an reaction counter to note the up votes and down votes to receive a feedback from the students side.
2. The General Discussion
The General Discussion Section Include a topic raised by any particular student or a faculty member and a followup thread of comments by the students or may interfered by the college Administration .
3. The Semester Forum
The Semester Forum includes all the talk about the current semester which may include syllabus discussion , exam tips from the faculty , sharing of semester notes , important papers and references and other semester linked stuff.
Thus , University Hub unlike any other college website is a common interactive link between various universities and their students in a more simplified and sorted manner.
You can view the prototype at : https://pr.to/AUJSZ7/

https://www.youtube.com/watch?v=H534mh8loTY

[!(https://img.youtube.com/vi/H534mh8loTY/0.jpg)](https://www.youtube.com/watch?v=H534mh8loTY)

The University Hub WebApp consists of three major screens or state.
Home Page

University Hub Home Page two main buttons for registeration and already registered users

#Registration Page

It involves the user to enter the asked details in order to make a profile on the app

Enter a unique username , Email and Password and click on the register button to initate and complete your registeration in a single step.

You will then be directed to the Announcement page with thw first major App screen
Announcements

The Announcement section include the official announcements from the university side and only has the write permission from the university side. The announcements section have an reaction counter to note the up votes and down votes to receive a feedback from the students side.

Thus this completes the First screen of my WebApp connected to the Backend
Backend :

Creating Custom Service and Authorized SSH Keys

This is the “Add a Custom Service” section of the Hasura platform which lets us create new services for our project. As you can see in the picture, it is very easy to create a new service, just give a Name, Enable the Git Push and click on create button at the bottom. Wait for a minute or so and your custom service will start running. After creating the service we need to add an Authorized SSH key to it, so that not everyone can directly access it. For that we need to first generate the ssh key by executing the following command :
ssh-keygen -t rsa

Then copy paste the rsa key to the Authorized SSH Keys section present in the Advanced Settings and click on Save button. Now we are already to push codes to our hasura repository.


Thank you and feel free to give your feedback, mail me at rishusharma.sharma7@gmail.com or visit me at www.rishabsharma.co.nf

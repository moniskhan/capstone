'use strict';

// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var addUserButton = document.getElementById("add_user_button");
    var userList = [];
    var numUser=0;

    addUserButton.addEventListener('click', function() {
        console.log("adding a new user");
        userList.push(new User('user' + numUser));

        var userDiv = document.createElement('div');
        var userTemplate = document.getElementById('user_entry');
        userDiv.appendChild(document.importNode(userTemplate.content, true));
        userDiv.classList.add('user_entry');
        userDiv.id = numUser;
        console.log(userList[numUser]);
        userDiv.querySelector('.user_entry_name').innerHTML = userList[numUser].getName();
        userDiv.querySelector('.user_entry_rank').innerHTML = userList[numUser].getRank();
        userDiv.querySelector('.user_entry_exp').innerHTML = userList[numUser].getExp();

        var postCommentButton = userDiv.querySelector('.user_entry_comment_button');

        postCommentButton.addEventListener('click', function() {
            console.log(userList[postCommentButton.parentElement.id]);
            var id = postCommentButton.parentElement.id;
            userList[id].gainExp();
            postCommentButton.parentElement.querySelector('.user_entry_rank').innerHTML = userList[id].getRank();            
            postCommentButton.parentElement.querySelector('.user_entry_exp').innerHTML = userList[id].getExp();            
        });

        document.getElementById('user_list').appendChild(userDiv);
        numUser++;
    });


});
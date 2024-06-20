const url = "http://localhost:8080/api/admin/";
const renderTable = document.getElementById("user-data");
const addForm = document.getElementById("add-form");



const renderPosts = (users) => {
    let temp = '';
    users.forEach((u) => {

        let rolesStr;
        if (Array.isArray(u.roles)) {
            rolesStr = u.roles
                .filter(role => role && role.roleName)
                .map(role => role && role.roleName.replace('ROLE_', ''))
                .join(', ');
        } else if (u.roles && u.roles.roleName) {

            rolesStr = u.roles.roleName.replace('Role_', '');
        }


        temp += `<tr>
                                    <td>${u.id}</td>
                                    <td id=${'name' + u.id}>${u.name}</td>
                                    <td id=${'lastname' + u.id}>${u.lastname}</td>
                                    <td id=${'username' + u.id}>${u.username}</td>
                                    <td id=${'role' + u.id}>${rolesStr}</td>
    
                                    <td>
                                    <button class="btn btn-info" type="button"
                                    data-toggle="modal" data-target="#modalEdit"
                                    onclick="editModal(${u.id})">Edit</button></td>
    
                                    <td>
                                    <button class="btn btn-danger" type="button"
                                    data-toggle="modal" data-target="#modalDelete"
                                    onclick="deleteModal(${u.id})">Delete</button></td>
                                    </tr>
                                    `
    })
    renderTable.innerHTML = temp;
}

function getAllUsers() {
    fetch(url + 'users')
        .then(res => res.json())
        .then(data => {
            renderPosts(data)
        })
}

addForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addUser()
        .then(() => {
            console.log("User added successfully");
        })
        .catch(error => {
            console.error("Error adding User:", error);
        });
});

function switchToUserTableTab() {
    // Получаем элементы вкладок и их содержимое
    let tabUsersTable = document.getElementById('usersTable');
    let tabNewUser = document.getElementById('user_panel');
    let usersTableContent = document.getElementById('usTable');
    let newUserContent = document.getElementById('newUs');

    // Устанавливаем класс "active" для нужной вкладки и убираем его у других
    tabUsersTable.classList.add('active');
    tabNewUser.classList.remove('active');

    // Показываем содержимое вкладки "Users Table" и скрываем содержимое вкладки "New User"
    usersTableContent.classList.add('show', 'active');
    usersTableContent.classList.remove('fade');
    newUserContent.classList.remove('show', 'active');
    newUserContent.classList.add('fade');
}

async function addUser() {

    clearValidationErrors();

    let nameValue = document.getElementById("name").value;
    let lastnameValue = document.getElementById("lastname").value;
    let usernameValue = document.getElementById("username").value;
    let passwordValue = document.getElementById('password').value;
    let rolesValue = Array.from(document.querySelectorAll('.roleCheckbox:checked'))
        .map(cb => parseInt(cb.value, 10));
    let newUser = {
        name: nameValue,
        lastname: lastnameValue,
        username: usernameValue,
        password: passwordValue,
        roles: rolesValue,
    }

    try {
        let response = await fetch(url + 'save', {
            method: "POST", headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json; charset=UTF-8'
            }, body: JSON.stringify(newUser)
        });
        if (!response.ok) {
            if (response.status === 400) {
                let errors = await response.json();
                console.log("Ответ сервера:", errors);
                displayValidationErrors(errors);
            } else {
                throw new Error(`Http error! status: ${response.status}`)
            }
        } else {

            document.getElementById("name").value = "";
            document.getElementById("lastname").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            Array.from(document.querySelectorAll('.roleCheckbox')).forEach(cb => cb.checked = false);

            await getAllUsers();
            switchToUserTableTab();
        }

    } catch (error) {
        console.log('Exception saving User', error);
    }
}

function deleteModal(id) {
    fetch(url + id, {
        headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(us => {

            document.getElementById('idDelete').value = us.id;
            document.getElementById('nameDelete').value = us.name;
            document.getElementById('lastnameDelete').value = us.lastname;
            document.getElementById('usernameDelete').value = us.username;
            Array.from(document.querySelectorAll('.roleCheckbox'))
                .map(cb => parseInt(cb.value, 10));
        })
    });
}


async function deleteUser() {
    await fetch(url + document.getElementById('idDelete').value, {
        method: 'DELETE', headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8'
        },
    })

    getAllUsers()
    document.getElementById("deleteButton").click();
}


function editModal(id) {

    clearEditFormValidationErrors();

    fetch(url + id, {
        headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(us => {

            document.getElementById('idEdit').value = us.id;
            document.getElementById('nameEdit').value = us.name;
            document.getElementById('lastnameEdit').value = us.lastname;
            document.getElementById('usernameEdit').value = us.username;
            document.getElementById('passwordEdit').value = us.password;

        })
    });
}

async function editUser() {
    let idValue = document.getElementById("idEdit").value;
    let nameValue = document.getElementById("nameEdit").value;
    let lastnameValue = document.getElementById("lastnameEdit").value;
    let usernameValue = document.getElementById("usernameEdit").value;
    let passwordValue = document.getElementById("passwordEdit").value;
    let roles = Array.from(document.querySelectorAll('input[name="role"]:checked')).map(cb => cb.value);

    let user = {
        id: idValue,
        name: nameValue,
        lastname: lastnameValue,
        username: usernameValue,
        password: passwordValue,
        roles: roles
    }
    try {
        let response = await fetch(url + 'edit/' + idValue, {
            method: "PUT", headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8'
            }, body: JSON.stringify(user)
        });
        if (!response.ok) {
            if (response.status === 400) {
                let errors = await response.json();
                console.log("Ответ сервера:", errors);
                displayEditFormValidationErrors(errors);
            } else {
                throw new Error(`Http error! status: ${response.status}`)
            }
        } else {

            document.getElementById("name").value = "";
            document.getElementById("lastname").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            Array.from(document.querySelectorAll('.roleCheckbox')).forEach(cb => cb.checked = false);

            getAllUsers();
            document.getElementById("updateButton").click();
        }

    } catch (error) {
        console.log('Exception edit User', error);
    }
}

const urlAuth = "http://localhost:8080/api/admin";
const data = document.getElementById("data-user");
const panel = document.getElementById("admin-panel");

function userAuthInfo() {
    let temp = '';
    fetch(urlAuth)
        .then((res) => res.json())
        .then((u) => {

            let rolesStr = u.roles.map(role => role.roleName.replace('ROLE_', '')).join(', ');


            temp += `<tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.lastname}</td>
            <td>${u.username}</td>
            <td>${rolesStr}</td>
            </tr>`;
            console.log(data);
            data.innerHTML = temp;
        })
}

function userPanel() {
    fetch(urlAuth)
        .then((res) => res.json())
        .then((u) => {
            let rolesStr = u.roles.map(role => role.roleName.replace('ROLE_', '')).join(', ');

            panel.innerHTML = `<h5>${u.username} with roles: ${rolesStr}</h5>`
        });
}

userPanel();

document.addEventListener('DOMContentLoaded', (event) => {
   const adminTab = document.getElementById('adPanel')

    if (adminTab) {
        adminTab.click();
    }
});
document.getElementById('adPanel').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('adPanel').classList.add('active');
    document.getElementById('usPanel').classList.remove('active')
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('userPanel').style.display = 'none';
    getAllUsers();
});

document.getElementById('usPanel').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('usPanel').classList.add('active');
    document.getElementById('adPanel').classList.remove('active');
    document.getElementById('userPanel').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    userAuthInfo();
});

document.getElementById('adPanel').addEventListener('click', function (event) {
    event.preventDefault();
    setActiveLink(this);
});

document.getElementById('usPanel').addEventListener('click', function (event) {
    event.preventDefault();
    setActiveLink(this);
});

function setActiveLink(activeLink) {
    let links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('btn-primary'));

    activeLink.classList.add('btn-primary');
}

function displayValidationErrors(errors) {
    // Очистка предыдущих ошибок
    clearValidationErrors();

    // Отображение новых ошибок
    for (const [fieldName, message] of Object.entries(errors)) {
        // Находим элемент по атрибуту name
        const inputElement = document.querySelector(`[name="${fieldName}"]`);
        if (inputElement) {
            // Создание и настройка элемента для сообщения об ошибке
            const errorDiv = document.createElement("div");
            errorDiv.className = "error-message";
            errorDiv.innerText = message;
            errorDiv.style.color = 'red';

            // Вставка сообщения об ошибке в DOM
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        }
    }
}

function clearValidationErrors() {
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(errorDiv => errorDiv.remove());

}
function displayEditFormValidationErrors(errors) {
    // Очистка предыдущих ошибок
    clearEditFormValidationErrors();

    // Отображение новых ошибок
    for (const [fieldName, message] of Object.entries(errors)) {
        // Находим элемент по атрибуту name в форме редактирования
        const inputElement = document.querySelector(`#modalEdit [name="${fieldName}"]`);
        if (inputElement) {
            // Создание и настройка элемента для сообщения об ошибке
            const errorDiv = document.createElement("div");
            errorDiv.className = "edit-form-error-message"; // Класс для стилизации сообщений об ошибках
            errorDiv.innerText = message;
            errorDiv.style.color = 'red'; // Пример стилизации

            // Вставка сообщения об ошибке в DOM
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        }
    }
}

function clearEditFormValidationErrors() {
    // Удаление существующих сообщений об ошибках в форме редактирования
    const existingErrors = document.querySelectorAll('#modalEdit .edit-form-error-message');
    existingErrors.forEach(errorDiv => errorDiv.remove());
}

// function loadRoles() {
//     fetch('http://localhost:8080/api/roles')
//         .then(res => res.json())
//         .then(data => {
//             displayRoles(data);
//         })
//         .catch(err => console.error("Ошибка при загрузке ролей:", err));
// }

function loadRoles() {
    fetch('http://localhost:8080/api/admin/roles') // Проверьте правильность URL для получения списка ролей
        .then(response => response.json())
        .then(roles => {
            rolesContainer.innerHTML = ''; // Очищаем предыдущие чекбоксы
            roles.forEach(role => {
                let label = document.createElement('label');
                label.className = 'form-check-label';
                let checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.className = "form-check-input roleCheckbox";
                checkbox.value = role.id;
                label.appendChild(checkbox);
                label.append(role.name.replace('ROLE_', ''));
                rolesContainer.appendChild(label);
            });
        })
        .catch(error => console.error('Ошибка при загрузке ролей:', error));
}

function displayRoles(roles) {
    const rolesContainer = document.getElementById("roles-checkboxes-container"); // Предполагаем, что у вас есть контейнер для чекбоксов

    // Очистка предыдущих чекбоксов
    rolesContainer.innerHTML = '';

    roles.forEach(role => {
        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.className = "form-check";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input roleCheckbox";
        checkbox.value = role.id;
        checkbox.id = `role-${role.id}`;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = `role-${role.id}`;
        label.textContent = role.roleName.replace('ROLE_', '');

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        rolesContainer.appendChild(checkboxWrapper);
    });
}

document.addEventListener('DOMContentLoaded', loadRoles);


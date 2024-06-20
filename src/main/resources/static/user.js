const data = document.getElementById("data-user");
const url = "http://localhost:8080/api/user";
const panel = document.getElementById("user-panel");

function userAuthInfo() {
    let temp = '';
    fetch(url)
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
            data.innerHTML = temp;

            panel.innerHTML = `<h5>${u.username} with roles: ${rolesStr}</h5>`
        });
}

userAuthInfo()
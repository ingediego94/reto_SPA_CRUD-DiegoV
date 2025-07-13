const url = "http://localhost:3301/students";

// Function to capture data from form once this has been charged on DOM
function initAddStudent(){
    const form = document.getElementById('studentForm');

    if(!form){
        console.warn("No se encontró ningún formulario de 'Student' en el DOM.")
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const id = document.getElementById('id').value;
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        //Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;
        const enrolNumber = document.getElementById('enrolNumber').value; 
        const admissionDate = document.getElementById('admissionDate').value;

        const data = {
            id: String(id),
            name: name,
            email: email,
            phone: parseInt(phone),
            enrol_number: enrolNumber,
            admission_date: admissionDate
        };

        try{
            const resultado = await addStudent(data);
            console.log('Estudiante registrado:', resultado);
            form.reset();
            await getUsers();
        }catch(error){
            console.info('Error al crear: ', error);
        }
    });
}

// GET method
async function getUsers(){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const result = await response.json();
        const tableResults = document.querySelector("#showStudentsTable tbody");

        if(Array.isArray(result)){
            let html = '';
            result.forEach(student => {
                html += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>${student.enrol_number}</td>
                    <td>${student.admission_date}</td>
                    <td>
                        <button class="btn edit-btn" data-id="${student.id}">Editar</button><button class="btn delete-btn" data-id="${student.id}">Eliminar</button>
                    </td>
                </tr>
                `;
            });
            
            tableResults.innerHTML = html;
        } else{
            throw new Error('La respuestadel servidor no es un arreglo valido.');
        }


    } catch (error) {
        console.info('Error al obtener los datos: ', error);
    }
};

getUsers();


// POST method
async function addStudent(student){
 // To validate before to recive
    if(!validateStudent(student)){
        console.log("Estudiante inválido. No se enviará al servidor.");
        return; // exit the application if the data is incorrect
    }

    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        };

        const result = await response.json();
        alert("Student created successfully !");
        console.log("Agregado con éxito.");
        return result;
    }catch(error){
        console.log("Se ha presentado un error.", error)
        throw error;
    }

}

function validateStudent(studentA){
    if(!studentA.id || !studentA.name || !studentA.email || typeof studentA.phone !== "number" ){
        console.log("Se presentó un fallo.");
        return false;
    }
    return true;
}


// PUT method
async function updateStudents(studentToUpdate){
    try{
        const response = await fetch(`${url}/${studentToUpdate.id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(studentToUpdate)
        });

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log("Estudiante actualizado: ", result);
        

    } catch(error){
        console.log("Error al actualizar.");
    }
}


// Delete method
async function deleteStudents(id){

    try{
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        alert("Estudiante eliminado: ", result);

    } catch(error){
        throw new Error('Error al eliminar: ', error);
    }

}




document.addEventListener('click', async function (event) {
    if(event.target.classList.contains('delete-btn')){
        const id = event.target.getAttribute('data-id');

        if(confirm(`Estas seguro que deseas eliminar el estudiante con ID ${id}?`)){
            try{
                await deleteStudents(id);
                await getUsers();   // Refresh the table
            } catch (err) {
                console.log('Error eliminando estudiante: ', err);
            }
        }

    }


    if(event.target.classList.contains('edit-btn')){
        const id = event.target.getAttribute('data-id');
        const container = document.getElementById('content');

        try{
            const response = await fetch(`${url}/${id}`);
            const data = await response.json();
            debugger;
            container.innerHTML = `
                <form id="edit-form"><input type="text" value=${data.name} placeholder="${data.name}"></input><input type="text" value=${data.email} placeholder="${data.email}"></input><input type="text" value=${data.phone} placeholder="${data.phone}"></input><input type="text" value=${data.enrol_number} placeholder="${data.enrol_number}"></input><input type="text" value=${data.admission_date} placeholder="${data.admission_date}"></input><button type="submit">Done</button></form>
            `

            const form = document.getElementById('edit-form');

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const childrens = form.childNodes;
                
                const newStudent = {
                    id,
                    name: childrens[0].value,
                    email: childrens[1].value,
                    phone: childrens[2].value,
                    enrol_number: childrens[3].value,
                    admission_date: childrens[4].value
                }

                updateStudents(newStudent)
                .then(res => window.location.reload())
                .then(err => console.error(err))
            })

        } catch(err){

        }

    }



})
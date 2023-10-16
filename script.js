var clientes = [];

var Cliente = function (nif, codigoProvincia, codigoLocalidad, nombre) {
    this.nif = nif;
    this.codigoProvincia = codigoProvincia;
    this.codigoLocalidad = codigoLocalidad;
    this.nombre = nombre;
}

function f_add() {
    var existe = f_existe_cliente(document.getElementById("nif").value);
    if (existe) {
        alert("cliente ya existe");
    } else {
        aux_cliente = new Cliente(
            document.getElementById("nif").value,
            document.getElementById("provincia").value,
            document.getElementById("localidad").value,
            document.getElementById("nombre").value
        );
        clientes.push(aux_cliente);
        fetch("http://localhost:8080/api/hacienda", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(aux_cliente),
          })
            .then(function (response) {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Error en la solicitud POST");
              }
            })
            .then(function (data) {
              alert("Alta de cliente exitosa");
              f_reset();
            })
            .catch(function (error) {
              console.error("Error en la solicitud POST: " + error);
              alert("Error en la solicitud POST");
            });
        }
    }



function f_reset() {
    document.getElementById("nif").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("provincia").value = "";
    document.getElementById("localidad").value = "";
}

function f_existe_cliente(nif) {
    for (i in clientes) {
        if (clientes[i].nif == nif) {
            return true;
        }
    }
    return false;
}


function cargarProvincias() {
var selectProvincias = document.getElementById("provincia");

fetch("http://localhost:8080/api/hacienda/provincias")
  .then(function(response) {
    return response.json(); 
  })
  .then(function(data) {
    //selectProvincias.innerHTML = '';
    /**var option_vacio = document.createElement("option");
    option_vacio.value = ""; 
    option_vacio.text = ""; 
    selectProvincias.appendChild(option_vacio);*/
    data.forEach(function(provincia) {
      var option = document.createElement("option");
      option.value = provincia.codigoProvincia; 
      option.text = provincia.descripcion; 
      selectProvincias.appendChild(option);
    });
    selectProvincias.addEventListener("change", function() {
        cargarLocalidadesPorProvincia(selectProvincias.value);
      });
  })
  .catch(function(error) {
    console.error("Error en la solicitud AJAX: " + error);
  });
}

function cargarLocalidadesPorProvincia(codigoProvincia) {
    var selectLocalidades = document.getElementById("localidad");
    fetch("http://localhost:8080/api/hacienda/localidades/" + codigoProvincia)
      .then(function(response) {
        return response.json(); 
      })
      .then(function(data) {
        selectLocalidades.innerHTML = '';
        data.forEach(function(localidad) {
          var option = document.createElement("option");
          option.value = localidad.codigoLocalidad; 
          option.text = localidad.descripcion; 
          selectLocalidades.appendChild(option);
        });
      })
      .catch(function(error) {
        console.error("Error en la solicitud AJAX: " + error);
      });
  }


window.onload = function () {

    cargarProvincias();
    add = document.getElementById("add");
    add.addEventListener('click', f_add);
    reset = document.getElementById("reset");
    reset.addEventListener('click', f_reset);
}
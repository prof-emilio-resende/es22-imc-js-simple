//** Infrastructure code area */
function createRequest() {
  var request = null;

  try {
    request = new XMLHttpRequest();
  } catch (ex) {
    try {
      console.log(
        "Erro tentando capturar XMLHttpRequest, tentando ActiveXObject Msxml2"
      );
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (otherEx) {
      console.log(
        "Erro tentando capturar Msxml2, tentando ActiveXObject Microsoft.XMLHTTP"
      );
      request = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }

  return request;
}

function handleRequest(request) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      return JSON.parse(request.responseText);
    }
  } else {
    console.log("response is not ready yet ...");
    return null;
  }
}

function calcularImcApi(peso, altura, callback) {
  var req = createRequest();
  if (!req) return null;

  req.onreadystatechange = function() {
    var res = handleRequest(this);
    if (res) callback(res['imc']);
  }
  req.open('POST', 'http://localhost:8080/imc/calculate', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify({
    'height': altura,
    'weight': peso
  }));
}

//** Domain code area */
function Pessoa(altura, peso) {
  console.log("teste pessoa");
  this.altura = altura;
  this.peso = peso;
}

function Nutricionista(altura, peso) {
  console.log("teste nutricionista");
  Pessoa.call(this, altura, peso);
  this.imc = function (callback) {
    //return this.peso / this.altura ** 2;
    calcularImcApi(this.peso, this.altura, callback);
  };
}
// implementacao no ECMA5 de heranca
Nutricionista.prototype = Object.create(Pessoa.prototype);
Nutricionista.prototype.constructor = Nutricionista;

function criarNutricionista(elAltura, elPeso) {
  var altura = parseFloat(elAltura.value);
  var peso = parseFloat(elPeso.value);

  console.log("*****");
  console.log(Nutricionista.prototype.constructor);
  return new Nutricionista(altura, peso);
}

function criaExecutarCalculoImc() {
  // preparando a funcao
  var elemAltura = document.getElementById("altura");
  var elemPeso = document.getElementById("peso");

  return function () {
    var pessoa = criarNutricionista(elemAltura, elemPeso);

    console.log("------");
    console.log(pessoa instanceof Pessoa);

    pessoa.imc(imprimirResultado);
  };
}

function imprimirResultado(imc) {
  document.getElementById("imc").innerHTML = imc;
}

window.onload = function () {
  var btn = document.getElementById("action");
  btn.addEventListener("click", criaExecutarCalculoImc());
};

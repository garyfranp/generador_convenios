

var app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope) {

/*
deudor.ap
deudor.am
deudor.noms

direccion.calle
direccion.num
direccion.cruzamientos
direccion.col 
direccion.ciudad
direccion.estado

convenio.monto_adeudo_total
convenio.numero_de_pagos
convenio.monto_de_pago
convenio.periodo_de_pago_en_dias
convenio.fecha_inicio
convenio.fecha_firma
*/
moment.locale('es');
$scope.deudor = {};
$scope.direccion = {};
$scope.convenio = {};

$scope.convenio.agregar_tabla = false;
$scope.direccion.ciudad = 'Mérida';
$scope.direccion.estado = 'Yucatán'; 
$scope.calendarioDeReembolsos = [];

var nombre = '';
var direccion_completa = '';

var monto_adeudo_total_en_num = '';
var monto_adeudo_total_en_texto = '';

var numero_de_pagos_en_num = '';
var numero_de_pagos_en_texto = '';

var monto_de_pago_en_num = '';
var monto_de_pago_en_texto = '';

var periodo_de_pago_en_dias_num = '';
var periodo_de_pago_en_dias_texto = '';


var dia_en_texto = '';
var mes_en_texto = '';
var anio_en_texto = '';
var fechaDeContrato = '';
var acreedor = 'Martin Ayora Diego Gualberto';

var fecha_inicio_pagos = '';
var fecha_firma = '';

function recolectar_info_del_formulario () {
  nombre = $scope.deudor.ap + ' ' + $scope.deudor.am + ' ' + $scope.deudor.noms;
  nombre = convertir_a_mayusculas_cada_palabra(nombre);   

  direccion_completa = 'Calle ' + $scope.direccion.calle + ' número ' + $scope.direccion.num + ' entre ' + $scope.direccion.cruzamientos + ', Col./Fracc. ' + $scope.direccion.col + ', ' + $scope.direccion.ciudad + ', ' + $scope.direccion.estado;
  
  monto_adeudo_total_en_num =  convertirAMoneda(Number($scope.convenio.monto_adeudo_total));
  monto_adeudo_total_en_texto = convertir_numero_a_texto($scope.convenio.monto_adeudo_total);
  monto_adeudo_total_en_texto = convertir_a_mayusculas_cada_palabra(monto_adeudo_total_en_texto);

  numero_de_pagos_en_num = convertirACadena(Number($scope.convenio.numero_de_pagos));
  numero_de_pagos_en_texto = convertir_numero_a_texto(Number($scope.convenio.numero_de_pagos));
  numero_de_pagos_en_texto = convertir_a_mayusculas_cada_palabra(numero_de_pagos_en_texto);

  monto_de_pago_en_num = convertirAMoneda(Number($scope.convenio.monto_de_pago));
  monto_de_pago_en_texto = convertir_numero_a_texto(Number($scope.convenio.monto_de_pago));
  monto_de_pago_en_texto = convertir_a_mayusculas_cada_palabra(monto_de_pago_en_texto);
  
  periodo_de_pago_en_dias_num = convertirACadena(Number($scope.convenio.periodo_de_pago_en_dias));
  periodo_de_pago_en_dias_texto = convertir_numero_a_texto(Number($scope.convenio.periodo_de_pago_en_dias));
  periodo_de_pago_en_dias_texto = convertir_a_mayusculas_cada_palabra(periodo_de_pago_en_dias_texto);

  fecha_inicio_pagos = moment($scope.convenio.fecha_inicio);
  fecha_firma = moment($scope.convenio.fecha_firma);

  fecha_inicio_pagos = fecha_inicio_pagos.format("DD [de] MMMM [del] YYYY");
  fecha_firma = fecha_firma.format("DD [días del mes de] MMMM [del] YYYY");
}



//convenio.agregar_tabla

$scope.generar = function () {
recolectar_info_del_formulario();
generar_convenio_en_pdf();

};//termina la funcion genrar



function generar_calendario_de_pago () {
  var diasDeCobro = [0,1,1,1,1,1,1];
  var numeroDePagos = numero_de_pagos_en_num;
  var periodoDePagoEnDias = periodo_de_pago_en_dias_num;
  var diasParaVencimiento = 1;
  var cuotaDeReembolso = monto_de_pago_en_num;
  var calendarioPagos = [];

  var fecha_de_pago = moment($scope.convenio.fecha_inicio).format("dddd DD [de] MMMM [del] YYYY");
  //-----------------------------------------------------------------------------
  var diaDeLaSemanaEnNum = 0;
  var acumuladorParaNumDePago = 1;//Inicia en pago 1
  
  calendarioPagos.push({
    'numero_de_pago':acumuladorParaNumDePago,
    'fecha_de_pago':fecha_de_pago,
    'monto_de_pago':cuotaDeReembolso
  });

  numeroDePagos--;
  //hasta qui se habra generado la primera fecha de pago
  let fechaCalendario = moment($scope.convenio.fecha_inicio);

  for (var i = 0; i < numeroDePagos; i++) {
  fechaCalendario = fechaCalendario.clone().add(periodoDePagoEnDias,'days');//sumamos el periodo de pago
  diaDeLaSemanaEnNum = fechaCalendario.day();
  //Si existe un dia que no se cobre
    while ( esDiaDeCobro(diasDeCobro,diaDeLaSemanaEnNum) == false ){
        fechaCalendario = fechaCalendario.add(1,'days');
        diaDeLaSemanaEnNum = fechaCalendario.day();
    };//termina while
    acumuladorParaNumDePago++;
    let a = fechaCalendario.format("dddd DD [de] MMMM [del] YYYY");
    calendarioPagos.push({
      'numero_de_pago':acumuladorParaNumDePago,
      'fecha_de_pago':a,
      'monto_de_pago':cuotaDeReembolso
    });
  
  };//termina for


return calendarioPagos;
}

//dom 0,lun 1, mar 2, mie 3, jue 4, vie 5 sab 6
function esDiaDeCobro (diasDeCobro,dia) {
if (diasDeCobro[dia] == 1 ) { return true; } else { return false; };
}//Termina funcion esDiaDeCobro ----------------------------------------------------------------------------------------

function convertirOrdinal (num) {
var N = Number(num);
var respuesta = " ";
var Unidad = ["","primero","segundo","tercero","cuarto","quinto","sexto","séptimo","octavo","noveno"];
var Decena = ["","décimo", "vigésimo","trigésimo","cuadragésimo","quincuagésimo","sexagésimo","septuagésimo","octogésimo","nonagésimo"];
var Centena = ["","centésimo","ducentésimo","tricentésimo"," cuadringentésimo", " quingentésimo", " sexcentésimo"," septingentésimo"," octingentésimo"," noningentésimo"];
var u = mod(N,10);
var decimal = (N/10);
var d = mod(decimal,10);
var cen = N/100;
var c = mod(cen,10);
if(N>=100){respuesta = Centena[c]+" "+Decena[d]+" "+Unidad[u];}
else{
      if(N>=10){respuesta = Decena[d]+" "+Unidad[u];}
      else{respuesta = Unidad[N];};
    };   
return respuesta;
}//Termina funcion convertirOrdinal


function convertirAMoneda(num) { return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); }
function convertirAFecha (fecha) { return moment(fecha).format("DD-MM-YYYY"); }
function convertirACadena (dato) { dato = '' + dato; return dato; }

function convertir_a_mayusculas_cada_palabra (texto) { 
  let arr = texto.split(" ");
  //loop through each element of the array and capitalize the first letter.
  for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  //Join all the elements of the array back into a string 
  //using a blankspace as a separator 
  return str2 = arr.join(" ");
}

function convertir_numero_a_texto(n){
var o=new Array("diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve");
var u=new Array("cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve");
var d=new Array("", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa");
var c=new Array("", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos");


  var n=parseFloat(n).toFixed(2); /*se limita a dos decimales, no sabía que existía toFixed() :)*/
  var p=n.toString().substring(n.toString().indexOf(".")+1); /*decimales*/
  var m=n.toString().substring(0,n.toString().indexOf(".")); /*número sin decimales*/
  var m=parseFloat(m).toString().split("").reverse(); /*tampoco que reverse() existía :D*/
  var t="";

  /*Se analiza cada 3 dígitos*/
  for (var i=0; i<m.length; i+=3)
  {
    var x=t;
    /*formamos un número de 2 dígitos*/
    var b=m[i+1]!=undefined?parseFloat(m[i+1].toString()+m[i].toString()):parseFloat(m[i].toString());
    /*analizamos el 3 dígito*/
    t=m[i+2]!=undefined?(c[m[i+2]]+" "):"";
    t+=b<10?u[b]:(b<30?o[b-10]:(d[m[i+1]]+(m[i]=='0'?"":(" y "+u[m[i]]))));
    t=t=="ciento cero"?"cien":t;
    if (2<i&&i<6)
      t=t=="uno"?"mil ":(t.replace("uno","un")+" mil ");
    if (5<i&&i<9)
      t=t=="uno"?"un millón ":(t.replace("uno","un")+" millones ");
    t+=x;
    //t=i<3?t:(i<6?((t=="uno"?"mil ":(t+" mil "))+x):((t=="uno"?"un millón ":(t+" millones "))+x));
  }

  //t+=" con "+p+"/100";
  /*correcciones*/
  t=t.replace("  "," ");
  t=t.replace(" cero","");
  //t=t.replace("ciento y","cien y");
  //alert("Numero: "+n+"\nNº Dígitos: "+m.length+"\nDígitos: "+m+"\nDecimales: "+p+"\nt: "+t);
  //document.getElementById("esc").value=t;
  return t;

}//termina funcion toWords
//------------------------------------------------------------------------------------------------------------------------------------------






function generar_convenio_en_pdf () {
var contenido = [];
if ($scope.convenio.agregar_tabla == true) {
  let calendario_de_pagos = generar_calendario_de_pago();
  let tabla_para_pdf = generar_tabla_para_pdf(calendario_de_pagos);
  contenido = [
  {text:'CONVENIO QUE CELEBRAN: \n\n',bold: true,fontSize: 18,alignment:'center'},
  {alignment:'justify',text:'DE UNA PARTE: EL CIUDADANO '+acreedor+' DE PERSONALIDAD SUFICIENTE Y ACREDITADA PARA LLEVAR CONVENIOS EN REPRESENTACIÓN DE LA PERSONA MORAL SOLUCRE S.A.P.I. DE C.V. \n\n'},
  {alignment:'justify',text:'DE LA OTRA PARTE: EL CIUDADANO '+nombre+', EN SU CARÁCTER DE DEUDOR PRINCIPAL.\n\n'}, 
  {alignment:'justify',text:'En la ciudad de Mérida, Capital del Estado de Yucatán a los '+fecha_firma+', entre los que suscribimos bajo formal protesta de decir verdad manifestamos ser:\n\n'},
  {alignment:'justify',text:'I.- El licenciado '+acreedor+', mayor de edad legal, casado, licenciado en administración, con domicilio para oír y recibir notificaciones en el predio marcado con el número doscientos setenta letra “A” de la calle cincuenta y nueve letra “A” cruzamiento con la calle ciento veinticuatro letra “D” y ciento veintiséis, fraccionamiento Yucalpetén de esta ciudad de Mérida, Yucatán.\n\n'},
  {alignment:'justify',text:'II.- El ciudadano '+nombre+', mayor de edad, con domicilio ubicado en '+direccion_completa+'.\n\n'},
  {text:'PERSONALIDADES: \n\n',bold: true,fontSize: 18,alignment:'center'},
  {alignment:'justify',text:'El licenciado '+acreedor+', comparece en su carácter de representante legal de SOLUCRE S.A.P.I. DE C.V. \n\n'},
  {alignment:'justify',text:'El ciudadano '+nombre+', comparece en su carácter de deudor principal del contrato de crédito adquirido en la sociedad denominada SOLUCRE S.A.P.I DE C.V. \n\n'},
  {alignment:'justify',text:'DECLARACIONES:\n\n'},
  {alignment:'justify',text:'I. Las partes contratantes manifestamos bajo formal protesta de decir verdad:\n\n'},
  {alignment:'justify',text:'II. '+nombre+' EN SU CARÁCTER DE DEUDOR PRINCIPAL, declara:\n\n'},
  {alignment:'justify',text:'   a)  Que reconoce como propio y a su cargo un adeudo a favor de “EL ACREEDOR” antes mencionado por la suma de '+monto_adeudo_total_en_num+' ('+monto_adeudo_total_en_texto +' pesos 00/100 M.N.) por concepto de suerte principal.\n\n'},
  {alignment:'justify',text:'III.  Ambas partes manifestamos que para todos los efectos legales procedentes en lo sucesivo se le denominará a '+nombre+' COMO EL DEUDOR y a '+acreedor+' en lo sucesivo se le denominará EL ACREEDOR, celebrando este acuerdo de voluntades por medio del presente convenio, al tenor de las siguientes.\n\n'},
  {text:' C L A S U L A S: \n\n',bold: true,fontSize: 18,alignment:'center'},
  {alignment:'justify',text:'PRIMERA.- Ambas partes convienen que EL DEUDOR pagará a EL ACREEDOR en concepto de pago la cantidad de '+monto_adeudo_total_en_num+' ('+monto_adeudo_total_en_texto +' pesos 00/100 M.N.) en buena moneda de curso legal, de la siguiente manera:\n\n'},
  {alignment:'justify',pageBreak: 'before', text:'a) '+numero_de_pagos_en_texto+' pagos pagaderos cada '+periodo_de_pago_en_dias_texto+' días iniciando el '+fecha_inicio_pagos+'. De la siguiente manera:\n\n'},
  {alignment:'justify',text:'1.- '+numero_de_pagos_en_texto+' pagos con '+periodo_de_pago_en_dias_texto+' días entre cada uno, LA CANTIDAD DE CADA UNO DE LOS PAGOS SERÁN POR '+monto_de_pago_en_num+' ('+monto_de_pago_en_texto+ ' pesos 00/100 M.N.). \n\n'},
  {alignment:'justify',text:'EL ESQUEMA DE PAGOS SE ANEXARÁ AL PRESENTE CONVENIO COMO APENDICE.\n\n'},
  {alignment:'justify',text:'En el recibo que se entregará a la parte DEUDORA se señalará:\n\n'},
  {alignment:'justify',text:'LOS PAGOS SE HARAN POR MEDIO DE DEPOSITO/TRANSFERENCIA QUEDANDO COMO RECIBO DE PAGO EL ACUSE QUE LA INSTITUCIÓN BANCARIA DONDE SE REALICE LA OPERACIÓN, POR LO ANTERIOR LA PARTE DEUDORA SERÁ RESPONSABLE DE PROCURAR SUS RECIBOS DE PAGO.\n\n'},
  {alignment:'justify',text:'SEGUNDA.- EL ACREEDOR, bajo formal protesta de decir verdad, otorga: que una vez realizado por EL DEUDOR el pago de la cantidad mencionada en la cláusula inmediata anterior, en los términos pactados, se obliga y compromete a lo siguiente: \n\n'},
  {alignment:'justify',text:'a) Regresar la devolución de los documentos (PAGARÉ) al DEUDOR una vez que se termine el pago total de la suma acordada en el esquema de pagos el cual se encuentra en el apéndice del presente convenio.\n\n'},
  {alignment:'justify',text:'TERCERA.- EL ACREEDOR y EL DEUDOR, reiteran de manera conjunta que la presente transacción se dará por terminada y sin materia el juicio cuando EL DEUDOR hayan cumplido plenamente con lo pactado en la cláusula primera de este convenio y en consecuencia, se procederá a liberar los gravámenes que pesan sobre el bien embargado, según lo pactado en la cláusula segunda de este mismo convenio o vencido por incumplimiento en caso de que EL DEUDOR falte a su obligación de pago pactada en este convenio y en consecuencia se continuará con la secuela del procedimiento Ejecutivo Mercantil hasta la obtención de todas y cada una de las prestaciones reclamadas inicialmente y sus accesorios, no procediendo en consecuencia ninguna de las quitas pactadas en este convenio.\n\n'},
  {alignment:'justify',text:'CUARTA.- Las partes contratantes manifiestan que para garantizar las obligaciones contraídas por EL DEUDOR en este convenio, los convenios y formatos firmados por el DEUDOR le serán entregados al finalizar la deuda en su totalidad.\n\n'},
  {alignment:'justify',text:'QUINTA.- En caso de que EL DEUDOR no cumplan estricta y puntualmente con todas y cada una de las obligaciones contraídas en este convenio, EL ACREEDOR dará por vencido los plazos pactados por este medio y podrá ejecutar de manera inmediata el presente convenio. Dicha ejecución se llevará a cabo con la sola manifestación al C. Juez del conocimiento que haga EL ACREEDOR de haberse actualizado el impago de una sola amortización pactada en el presente convenio.\n\n'},
  {alignment:'justify',text:'SEXTA.- Para todo lo relativo a la interpretación, cumplimiento o ejecución del presente convenio, las partes señalan como sus domicilios para oír y recibir toda clase de notificaciones, los domicilios siguientes:\n\n'},
  {alignment:'justify',text:'EL DEUDOR: ubicado en '+direccion_completa+'.\n\n'},
  {alignment:'justify',pageBreak: 'before', text:'EL ACREEDOR: predio marcado con el número doscientos setenta letra “A” de la calle cincuenta y nueve letra “A” cruzamiento con la calle ciento veinticuatro letra “D” y ciento veintiséis, fraccionamiento Yucalpetén de esta ciudad de Mérida, Yucatán.\n\n'},
  {alignment:'justify',text:'SEPTIMA.- Ambas partes contratantes otorgan de común acuerdo que: una vez cumplidas las obligaciones contraídas por las partes en este convenio el expediente del cual deriva lo pactado en este acto deberá ser archivado por la autoridad del conocimiento, como asunto total y definitivamente concluido, en caso de incumplimiento por parte de EL DEUDOR el expediente deberán seguir su curso legal hasta obtener el pago de todas las prestaciones reclamadas y accesorios procedentes.\n\n'},
  {alignment:'justify',text:'OCTAVA.- Para la interpretación y cumplimiento del presente convenio, ambas partes nos sometemos expresamente a la jurisdicción y competencia del Ciudadano Juez MERCANTIL del Primer Departamento Judicial del Estado, al que exhibiremos el presente convenio para su aprobación por estar ajustado a derecho y no ir en contra de la ley, moral o buenas costumbres y tener esta transacción respecto a las partes, con la misma eficacia y autoridad de cosa juzgada, razón por la cual solicitamos nos condene a estar y pasar por su tenor, pues su incumplimiento dará derecho a cualquiera de las partes a promover su ejecución por la vía de apremio con todas sus legales consecuencias.\n\n'},
  {alignment:'justify',text:'NOVENA.- FORMALIDAD.- Cualquier convenio verbal que se llegaré a celebrar entre las partes, no será válido, no teniendo en consecuencia efecto legal alguno, pues para que tenga validez es necesario que se celebre por escrito.\n\n'},
  {alignment:'justify',text:'DECIMA.- Ambas manifestamos de común acuerdo que en la celebración del presente convenio no existió dolo, error o mala fe, y que el contenido del mismo expresa la voluntad de los que suscribimos, tal y como ratificamos con la firma que consta al calce y a los costados de todas y cada una de las hojas que integran el presente convenio.\n\n'},
  {alignment:'justify',text:'Leído que fue el contenido del presente documento por cada una de las partes y enterados sus suscriptores de su contenido y efectos jurídicos, lo signan por triplicado en la ciudad de Mérida, Yucatán, a los '+fecha_firma+'.\n\n'},
  '\n\n',
  '\n\n',
  '\n\n',
  {alignment:'center',columns: [{text:'ACREEDOR'},{text:'DEUDOR PRINCIPAL'}]},
  '\n\n\n',
  {alignment:'center',columns: [{text:'_____________________________________'},{text:'_____________________________________'}]},
  {alignment:'center',columns: [{text:'Lic.'+acreedor+' CON PERSONALIDAD PARA REPRESENTAR A SOLUCRE S.A.P.I DE C.V.'},{text:nombre}]},
  {alignment:'justify',pageBreak: 'before', text:'\n\n'},
  {text:'Apéndice\n\n',bold: true,fontSize:12,alignment:'center'},
  {table: { headerRows: 1, widths: [ 'auto','auto','auto'], body: tabla_para_pdf }},
  ];//termina variable contenido

}else{

contenido = [
  {text:'CONVENIO QUE CELEBRAN: \n\n',bold: true,fontSize: 18,alignment:'center'},
  {alignment:'justify',text:'DE UNA PARTE: EL CIUDADANO '+acreedor+' DE PERSONALIDAD SUFICIENTE Y ACREDITADA PARA LLEVAR CONVENIOS EN REPRESENTACIÓN DE LA PERSONA MORAL SOLUCRE S.A.P.I. DE C.V. \n\n'},
  {alignment:'justify',text:'DE LA OTRA PARTE: EL CIUDADANO '+nombre+', EN SU CARÁCTER DE DEUDOR PRINCIPAL.\n\n'}, 
  {alignment:'justify',text:'En la ciudad de Mérida, Capital del Estado de Yucatán a los '+fecha_firma+', entre los que suscribimos bajo formal protesta de decir verdad manifestamos ser:\n\n'},
  {alignment:'justify',text:'I.- El licenciado '+acreedor+', mayor de edad legal, casado, licenciado en administración, con domicilio para oír y recibir notificaciones en el predio marcado con el número doscientos setenta letra “A” de la calle cincuenta y nueve letra “A” cruzamiento con la calle ciento veinticuatro letra “D” y ciento veintiséis, fraccionamiento Yucalpetén de esta ciudad de Mérida, Yucatán.\n\n'},
  {alignment:'justify',text:'II.- El ciudadano '+nombre+', mayor de edad, con domicilio ubicado en '+direccion_completa+'.\n\n'},
  {text:'PERSONALIDADES: \n\n',bold: true,fontSize: 18,alignment:'center'},
  {alignment:'justify',text:'El licenciado '+acreedor+', comparece en su carácter de representante legal de SOLUCRE S.A.P.I. DE C.V. \n\n'},
  {alignment:'justify',text:'El ciudadano '+nombre+', comparece en su carácter de deudor principal del contrato de crédito adquirido en la sociedad denominada SOLUCRE S.A.P.I DE C.V. \n\n'},
  {alignment:'justify',text:'DECLARACIONES:\n\n'},
  {alignment:'justify',text:'I. Las partes contratantes manifestamos bajo formal protesta de decir verdad:\n\n'},
  {alignment:'justify',text:'II. '+nombre+' EN SU CARÁCTER DE DEUDOR PRINCIPAL, declara:\n\n'},
  {alignment:'justify',text:'   a)  Que reconoce como propio y a su cargo un adeudo a favor de “EL ACREEDOR” antes mencionado por la suma de '+monto_adeudo_total_en_num+' ('+monto_adeudo_total_en_texto +' pesos 00/100 M.N.) por concepto de suerte principal.\n\n'},
  {alignment:'justify',text:'III.  Ambas partes manifestamos que para todos los efectos legales procedentes en lo sucesivo se le denominará a '+nombre+' COMO EL DEUDOR y a '+acreedor+' en lo sucesivo se le denominará EL ACREEDOR, celebrando este acuerdo de voluntades por medio del presente convenio, al tenor de las siguientes.\n\n'},
  {text:' C L A S U L A S: \n\n',bold: true,fontSize: 18,alignment:'center'},
  {alignment:'justify',text:'PRIMERA.- Ambas partes convienen que EL DEUDOR pagará a EL ACREEDOR en concepto de pago la cantidad de '+monto_adeudo_total_en_num+' ('+monto_adeudo_total_en_texto +' pesos 00/100 M.N.) en buena moneda de curso legal, de la siguiente manera:\n\n'},
  {alignment:'justify',pageBreak: 'before', text:'a) '+numero_de_pagos_en_texto+' pagos pagaderos cada '+periodo_de_pago_en_dias_texto+' días iniciando el '+fecha_inicio_pagos+'. De la siguiente manera:\n\n'},
  {alignment:'justify',text:'1.- '+numero_de_pagos_en_texto+' pagos con '+periodo_de_pago_en_dias_texto+' días entre cada uno, LA CANTIDAD DE CADA UNO DE LOS PAGOS SERÁN POR '+monto_de_pago_en_num+' ('+monto_de_pago_en_texto+ ' pesos 00/100 M.N.). \n\n'},
  {alignment:'justify',text:'EL ESQUEMA DE PAGOS SE ANEXARÁ AL PRESENTE CONVENIO COMO APENDICE.\n\n'},
  {alignment:'justify',text:'En el recibo que se entregará a la parte DEUDORA se señalará:\n\n'},
  {alignment:'justify',text:'LOS PAGOS SE HARAN POR MEDIO DE DEPOSITO/TRANSFERENCIA QUEDANDO COMO RECIBO DE PAGO EL ACUSE QUE LA INSTITUCIÓN BANCARIA DONDE SE REALICE LA OPERACIÓN, POR LO ANTERIOR LA PARTE DEUDORA SERÁ RESPONSABLE DE PROCURAR SUS RECIBOS DE PAGO.\n\n'},
  {alignment:'justify',text:'SEGUNDA.- EL ACREEDOR, bajo formal protesta de decir verdad, otorga: que una vez realizado por EL DEUDOR el pago de la cantidad mencionada en la cláusula inmediata anterior, en los términos pactados, se obliga y compromete a lo siguiente: \n\n'},
  {alignment:'justify',text:'a) Regresar la devolución de los documentos (PAGARÉ) al DEUDOR una vez que se termine el pago total de la suma acordada en el esquema de pagos el cual se encuentra en el apéndice del presente convenio.\n\n'},
  {alignment:'justify',text:'TERCERA.- EL ACREEDOR y EL DEUDOR, reiteran de manera conjunta que la presente transacción se dará por terminada y sin materia el juicio cuando EL DEUDOR hayan cumplido plenamente con lo pactado en la cláusula primera de este convenio y en consecuencia, se procederá a liberar los gravámenes que pesan sobre el bien embargado, según lo pactado en la cláusula segunda de este mismo convenio o vencido por incumplimiento en caso de que EL DEUDOR falte a su obligación de pago pactada en este convenio y en consecuencia se continuará con la secuela del procedimiento Ejecutivo Mercantil hasta la obtención de todas y cada una de las prestaciones reclamadas inicialmente y sus accesorios, no procediendo en consecuencia ninguna de las quitas pactadas en este convenio.\n\n'},
  {alignment:'justify',text:'CUARTA.- Las partes contratantes manifiestan que para garantizar las obligaciones contraídas por EL DEUDOR en este convenio, los convenios y formatos firmados por el DEUDOR le serán entregados al finalizar la deuda en su totalidad.\n\n'},
  {alignment:'justify',text:'QUINTA.- En caso de que EL DEUDOR no cumplan estricta y puntualmente con todas y cada una de las obligaciones contraídas en este convenio, EL ACREEDOR dará por vencido los plazos pactados por este medio y podrá ejecutar de manera inmediata el presente convenio. Dicha ejecución se llevará a cabo con la sola manifestación al C. Juez del conocimiento que haga EL ACREEDOR de haberse actualizado el impago de una sola amortización pactada en el presente convenio.\n\n'},
  {alignment:'justify',text:'SEXTA.- Para todo lo relativo a la interpretación, cumplimiento o ejecución del presente convenio, las partes señalan como sus domicilios para oír y recibir toda clase de notificaciones, los domicilios siguientes:\n\n'},
  {alignment:'justify',text:'EL DEUDOR: ubicado en '+direccion_completa+'.\n\n'},
  {alignment:'justify',pageBreak: 'before', text:'EL ACREEDOR: predio marcado con el número doscientos setenta letra “A” de la calle cincuenta y nueve letra “A” cruzamiento con la calle ciento veinticuatro letra “D” y ciento veintiséis, fraccionamiento Yucalpetén de esta ciudad de Mérida, Yucatán.\n\n'},
  {alignment:'justify',text:'SEPTIMA.- Ambas partes contratantes otorgan de común acuerdo que: una vez cumplidas las obligaciones contraídas por las partes en este convenio el expediente del cual deriva lo pactado en este acto deberá ser archivado por la autoridad del conocimiento, como asunto total y definitivamente concluido, en caso de incumplimiento por parte de EL DEUDOR el expediente deberán seguir su curso legal hasta obtener el pago de todas las prestaciones reclamadas y accesorios procedentes.\n\n'},
  {alignment:'justify',text:'OCTAVA.- Para la interpretación y cumplimiento del presente convenio, ambas partes nos sometemos expresamente a la jurisdicción y competencia del Ciudadano Juez MERCANTIL del Primer Departamento Judicial del Estado, al que exhibiremos el presente convenio para su aprobación por estar ajustado a derecho y no ir en contra de la ley, moral o buenas costumbres y tener esta transacción respecto a las partes, con la misma eficacia y autoridad de cosa juzgada, razón por la cual solicitamos nos condene a estar y pasar por su tenor, pues su incumplimiento dará derecho a cualquiera de las partes a promover su ejecución por la vía de apremio con todas sus legales consecuencias.\n\n'},
  {alignment:'justify',text:'NOVENA.- FORMALIDAD.- Cualquier convenio verbal que se llegaré a celebrar entre las partes, no será válido, no teniendo en consecuencia efecto legal alguno, pues para que tenga validez es necesario que se celebre por escrito.\n\n'},
  {alignment:'justify',text:'DECIMA.- Ambas manifestamos de común acuerdo que en la celebración del presente convenio no existió dolo, error o mala fe, y que el contenido del mismo expresa la voluntad de los que suscribimos, tal y como ratificamos con la firma que consta al calce y a los costados de todas y cada una de las hojas que integran el presente convenio.\n\n'},
  {alignment:'justify',text:'Leído que fue el contenido del presente documento por cada una de las partes y enterados sus suscriptores de su contenido y efectos jurídicos, lo signan por triplicado en la ciudad de Mérida, Yucatán, a los '+fecha_firma+'.\n\n'},
  '\n\n',
  '\n\n',
  '\n\n',
  {alignment:'center',columns: [{text:'ACREEDOR'},{text:'DEUDOR PRINCIPAL'}]},
  '\n\n\n',
  {alignment:'center',columns: [{text:'_____________________________________'},{text:'_____________________________________'}]},
  {alignment:'center',columns: [{text:'Lic.'+acreedor+' CON PERSONALIDAD PARA REPRESENTAR A SOLUCRE S.A.P.I DE C.V.'},{text:nombre}]},
  ];//termina variable contenido
  
};//termina if

var docDefinition = {
  footer: function(currentPage, pageCount) { 
            var a = currentPage.toString(); var b = pageCount;
            var c = {text: [{text: 'Página '+a+' de '+b, italics: true, fontSize: 10, alignment:'center'}]}
            return  c;
            },
  content: contenido,// termina contenido
  defaultStyle: {font: 'consolas'},
  styles: {estilocuerpo: {fontSize: 8,margin: [0, 5, 0, 15]}}
};// termina definicion de parametros del documento


//Configuramos la fuente del documento
pdfMake.fonts = { consolas: { normal: 'consola.ttf',bold: 'consolab.ttf',italics: 'consolai.ttf',bolditalics: 'consolaz.ttf'} };
pdfMake.createPdf(docDefinition).open();

}




function generar_tabla_para_pdf (arregloDeDatos) {
var array = new Array(arregloDeDatos.length+3); 
//primero asigmanos los cabezales de las columnas y le damos formato
array[0] = [{ text:nombre,alignment: 'center', colSpan: 3,fillColor: '#000000', color: '#FFFFFF',bold: true,fontSize: 12},
              {},{}];
array[1] = [{ text:'Monto a liquidar: '+monto_adeudo_total_en_num+' Plazo: '+numero_de_pagos_en_num+' pagos',alignment: 'center', colSpan: 3,fillColor: '#E2E2E2', color: '#000000',fontSize: 12},
              {},{}];
array[2] = [{ text:'Número de pago',alignment: 'center',fillColor: '#E2E2E2', color: '#000000',fontSize: 10},
            { text:'Fecha de pago',alignment: 'center',fillColor: '#E2E2E2', color: '#000000',fontSize: 10},
            { text:'Monto de pago',alignment: 'center',fillColor: '#E2E2E2', color: '#000000',fontSize: 10}
            ];
//let j = 0;j++;
  for (var i = 0; i < arregloDeDatos.length; i++) {
    array[i+3] =[ arregloDeDatos[i].numero_de_pago, arregloDeDatos[i].fecha_de_pago, arregloDeDatos[i].monto_de_pago];
  };
return array;
}










});//termina controlador
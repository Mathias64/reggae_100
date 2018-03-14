/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var artiste = document.querySelector('#artiste');
var contenu = document.querySelector('#contenu');
var variations = document.querySelector('.variations');
var texte = document.querySelector('.texte');
var paroles = document.querySelector('.paroles');
var conseil = document.querySelector('.conseil');
var texte = document.querySelector('.texte');
var i = 0;


var requestURL = 'res/data.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
    var superHeroes = request.response;
    populateHeader(superHeroes, 1);
    showHeroes(superHeroes);
};

function populateHeader(tubes, i) {
    artiste.textContent = tubes[i].artiste;
    var myPara = document.createElement('p');
        myPara.textContent = 'Hometown: ' + jsonObj['homeTown'] + ' // Formed: ' + jsonObj['formed'];
        header.appendChild(myPara);
}

function showHeroes(jsonObj) {
    var heroes = jsonObj['members'];
    for(var i = 0; i < heroes.length; i++) {
        var myArticle = document.createElement('article');
        var myH2 = document.createElement('h2');
        var myPara1 = document.createElement('p');
        var myPara2 = document.createElement('p');
        var myPara3 = document.createElement('p');
        var myList = document.createElement('ul');
        myH2.textContent = heroes[i].name;
        myPara1.textContent = 'Secret identity: ' + heroes[i].secretIdentity;
        myPara2.textContent = 'Age: ' + heroes[i].age;
        myPara3.textContent = 'Superpowers:';
        var superPowers = heroes[i].powers;
        for(var j = 0; j < superPowers.length; j++) {
            var listItem = document.createElement('li');
            listItem.textContent = superPowers[j];
            myList.appendChild(listItem);
        }
        myArticle.appendChild(myH2);
        myArticle.appendChild(myPara1);
        myArticle.appendChild(myPara2);
        myArticle.appendChild(myPara3);
        myArticle.appendChild(myList);
        section.appendChild(myArticle);
    }
}
    
    
//Retrieving data:
//text = localStorage.getItem("testJSON");
//obj = JSON.parse(text);
//document.getElementById("demo").innerHTML = obj.name;

// Validation des données JSON
//var strPersonne = '{"nom": "Smith", "prenom": "John", "ville": "Avignon"}';
//
//var personne = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
//                    strPersonne.replace(/"(\\.|[^"\\])*"/g, '')))
//                && eval('(' + strPersonne + ')');
//
//if (personne !== false)
//{
//    alert(personne.prenom + ' ' + personne.nom);
//}
//else
//{
//    alert('JSON invalide');
//}


//$(document).ready(function() {
//          $.getJSON('data.json',function(donnees){
//            $('#artiste').html(donnees.artiste);
//            $('#variations').html('<p><b>Variations complémentaires : </b>' + donnees.variations + '</p>');
//            });
//          });
//
////Retrieving data:
//donnees = localStorage.getItem("data.json");
//tube = JSON.parse(donnees);
//document.getElementById("variations").innerHTML = tube.variations;



//function recherche(valeur) {
// var data_json;
// $.ajax({
//  url : "test9280.json",
//  async: false,
//  type: "get",
//  data : {r:Math.random()},
//  dataType: 'json'
// }).done(function(html) {data_json= html;}); 
// var toto = data_json['produit'];
// for (var i=0;i<toto.length;i++) {
//  if (toto[i].nom == valeur) {
//   alert(valeur + ' trouvée. Prix = '+toto[i].prix);
//   return;
//  }
// }
// alert('Rien trouvé');
// return;
//}
//fonction constructeur contenant les attributs propre a chaque lecteur
function cercle_audio(config) {

    this.alpha=0;
		
    if (config.playliste) {
            this.playlist= config.playliste;
            this.audio=new Audio();
            this.audio.onloadedmetadata=this.marchearret.bind(this);
            this.audio.onerror=this.erreur.bind(this);
    } else {
            this.playlist=false;
            this.audio=new Audio(config.fichier);
    }
    
    this.diametre=config.diametre_lecteur;
    this.rayon=this.diametre/2;
    this.rotation=config.rotation;
    this.angle_rotation=0;
    this.timer=config.rotation ? 40 : 110;
    this.vitesse_rotation=config.vitesse_rotation;
    this.inter='vide';
    this.nombre=0;
    this.tb_instances.push(this);
    this.detection=config.diametre_detect;
    this.epaisseur_barre=config.epaisseur_barre;
    this.couleur_centre=config.couleur_centre;
    this.couleur_progres=config.couleur_progres;
    this.couleur_fond=config.couleur_fond;
    this.couleur_ombre=config.couleur_ombre;
    this.res=config.ressources;

    var that=this;

    this.boupn  =function(e){that.bouplino.call(that,e);};
    this.bp     =function(e){that.boupli.call(that,e);};
    this.metson =function(e){that.event_son.call(that,e);};
    this.retson =function(e){that.no_event_son.call(that,e);};
    this.sn     =function(e){that.sonson.call(that,e);};

    if (config.image) {
        this.image = new Image();
        this.image.src=config.image;
        var that=this;
        this.image.onload = function() {
            var cvs=document.createElement("canvas");
            cvs.height= that.diametre;
            cvs.width=that.diametre;

            var ctx=cvs.getContext('2d'); 
            ctx.beginPath();
            ctx.arc(that.rayon,that.rayon,(that.rayon)-that.epaisseur_barre,0,3.14*2,false);
            ctx.closePath();
            var pattern = ctx.createPattern(that.image, 'no-repeat');
            ctx.fillStyle = pattern;
            ctx.fill();

            that.rotat_image=cvs;

            that.init(config.conteneur,config.class_suplementaire);
        };
    } else if (this.playlist && this.playlist[0].image) {
            this.image = new Image();
            this.image.src=this.playlist[0].image;
            var that=this;
            this.image.onload = function(){
                    var cvs=document.createElement("canvas");
                    cvs.height= that.di;
                    cvs.width=that.diametre;

                    that.image.height=that.diametre;
                    that.image.width=that.diametre;
                    var ctx=cvs.getContext('2d'); 
                    ctx.beginPath();
                    ctx.arc(that.rayon,that.rayon,(that.rayon)-that.epaisseur_barre,0,3.14*2,false);
                    ctx.closePath();
                    var pattern = ctx.createPattern(that.image, 'no-repeat');
                    ctx.fillStyle = pattern;
                    ctx.fill();

                    that.rotat_image=cvs;

                    that.init(config.conteneur, config.class_suplementaire);
            };
    } else {
        this.init(config.conteneur, config.class_suplementaire);
    }
}

    //creation dynamique du lecteur---------------------------------------------
    cercle_audio.prototype.init=function(receveur,class_sup) {		
        this.cvs=document.createElement("canvas");
        this.cvs.height=this.diametre;
        this.cvs.width=this.diametre;
//        this.cvs.style.height=this.diametre+"px";
//        this.cvs.style.width=this.diametre+"px";
        this.cvs.style.borderRadius=this.rayon+"px";
        this.cvs.classList.add("cvs_audio");
        this.cvs.onmousedown=this.boupliev.bind(this);
        document.getElementById(receveur).appendChild(this.cvs);

        var command=document.createElement("div");
        command.classList.add("ctn_controle");
        if (class_sup) {
            command.classList.add(class_sup);
        }
        this.tmp=document.createElement("div");
        this.tmp.classList.add("tmpval");
        this.tmp.textContent="00:00";
        this.tmp.onclick=this.toto.bind(this);
        command.appendChild(this.tmp);

        var touche=document.createElement("div");
        touche.classList.add("touche");

        if (this.playlist) {
            var precedent=document.createElement("div");
            precedent.classList.add("precedent");
            precedent.onclick=this.precedent.bind(this);
            touche.appendChild(precedent);
        }

        this.ma=document.createElement("div");
        this.ma.classList.add("btn_play");

        this.ma.onclick=this.marchearret.bind(this);
        touche.appendChild(this.ma);

        if (this.playlist) {
            var suivant=document.createElement("div");
            suivant.classList.add("suivant");
            suivant.onclick=this.suivant.bind(this);
            touche.appendChild(suivant);
        }

        command.appendChild(touche);

        this.ctn_vol=document.createElement("div");
        this.ctn_vol.classList.add("volbar");
        this.ctn_vol.onmousedown=this.event_son.bind(this);

        var cur_vol=document.createElement("div");
        cur_vol.classList.add("volcur");
        this.ctn_vol.appendChild(cur_vol);
        command.appendChild(this.ctn_vol);

        document.getElementById(receveur).appendChild(command);

        var ctx = this.cvs.getContext('2d');

        ctx.beginPath();
        ctx.fillStyle = this.couleur_fond;
        ctx.rect(0,0,this.cvs.width,this.cvs.height);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.cvs.width/2,0);
        ctx.lineTo(this.cvs.width/2, this.cvs.height / 2);
        ctx.strokeStyle = this.couleur_centre;
        ctx.shadowColor = this.couleur_ombre;
        ctx.shadowBlur = 10;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.cvs.width/2,this.cvs.height/2,(this.cvs.height/2)-this.epaisseur_barre,-0,3.14*2,false);
        ctx.closePath();

        if (this.image) {
            var pattern = ctx.createPattern(this.image, 'no-repeat');
            ctx.fillStyle = pattern;
        } else{
            ctx.fillStyle = this.couleur_centre;
        }

        ctx.fill();

        this.audio.onerror=function(){this.tmp.textContent="echec chargement";}.bind(this);
    };

    cercle_audio.prototype.boupliev=function(e) {
        var lui=this.cvs;
        var posi=lui.getBoundingClientRect();
        var X =posi.left+lui.offsetWidth/2-e.clientX;
        var Y =posi.top+lui.offsetHeight/2-e.clientY;

        if (Math.sqrt(Y*Y+X*X)>=this.detection) {
            e.preventDefault();
            this.boupli(e);
            var dde=document.documentElement;

            clearInterval(this.inter);

            dde.addEventListener("mousemove", this.bp, false);
            dde.addEventListener("mouseup", this.boupn, false);
        }
    };

    cercle_audio.prototype.bouplino=function(e) {
        var dde=document.documentElement;

        dde.removeEventListener("mousemove", this.bp, false);
        dde.removeEventListener("mouseup", this.boupn, false);

        if(!this.audio.paused) {
            this.inter=setInterval(this.posivi.bind(this),this.timer);
        }
    };

    cercle_audio.prototype.boupli=function(e) {
        var lui=this.cvs;

        //position  du conteneur du bouton dans la page
        var posi=lui.getBoundingClientRect();

        //distance de la souris par rapport au centre du bouton pour les axes X et Y
        //la distance entre la souris et le centre du bouton donne le rayon d'un cercle
        var X =posi.left+lui.offsetWidth/2-e.clientX;
        var Y =posi.top+lui.offsetHeight/2-e.clientY;

        //on calcule la tangente du triangle rectangle de coté X et Y on fait inverse tangente (Math.atan)
        // afin d'obtenir l'arctangente exprimé en radian
        //je rajoute 3.14 degre afin de demarrer la rotation à partir du haut. Cette valeur est modifiable selon besoin
        var alpha=(Math.atan(Y/X)+(3.14/2)).toFixed(3);

        //le calcul se faisant sur un demi-cercle, quand X est supperieur à 0 partie gauche on rajoute 3.14
        if (X>=0) {
            alpha=(Number(alpha)+3.14).toFixed(3);
        }

        //conversion de l'angle afin d'obtenir une valeur allant de 0 a 1 
        //qui peut etre utile quand on associe le bouton à une autre valeur (produit en croix)
        var alpha2=((1/(3.14*2))*alpha).toFixed(3);
        this.audio.currentTime=this.audio.duration*alpha2;

        //document.getElementById('inp1').value='X:'+X+'   Y:'+Y;
        //document.getElementById('inp2').value=alpha+' rad';
        //document.getElementById('inp3').value=alpha2;
        this.posivi();
    };

    //fonction marche arret du lecteur------------------------------------------
    cercle_audio.prototype.marchearret=function() {
        if (this.audio.src==="") {
            this.change();
            return false;
        }

        for (var i=0; i <this.tb_instances.length; i++) {
            if (!this.tb_instances[i].audio.paused && this.tb_instances[i]!== this) {
                this.tb_instances[i].audio.pause();
                this.tb_instances[i].ma.classList.remove("btn_pause");
                this.tb_instances[i].ma.classList.add("btn_play");
                clearInterval(this.tb_instances[i].inter);
                break;
                }
            }

            if (this.audio.paused===true) {
                this.audio.play();
                this.ma.classList.remove("btn_play");
                this.ma.classList.add("btn_pause");
                this.inter=setInterval(this.posivi.bind(this),this.timer);
            } else {
                this.audio.pause();
                this.ma.classList.remove("btn_pause");
                this.ma.classList.add("btn_play");
                clearInterval(this.inter);
            }
    };

    //calculer de l'angle de la barre de progression----------------------------
    cercle_audio.prototype.posivi=function() {		
        if(this.audio.ended) {
            this.fin();
            return false;
        }
        //retourne une valeur comprise entre 0 et 1
        var valeur=(this.audio.currentTime/this.audio.duration).toFixed(6);
        //retourne l'angle de rotation en radian
        var alpha=valeur/(1/(3.14*2));

        this.dessine(alpha);
        this.temp();
    };

    //dessine la barre de progression dans le canvas
    cercle_audio.prototype.dessine=function(alpha) {		

        var ctx = this.cvs.getContext('2d');
        //efface le canvas
        ctx.beginPath();
        ctx.fillStyle = this.couleur_fond;
        ctx.rect(0,0,this.cvs.width,this.cvs.height);
        ctx.fill();
        ctx.save();
        //dessin de la barre de progression
        ctx.beginPath();
        ctx.moveTo(this.cvs.width/2, this.cvs.height /2);
        ctx.lineTo(this.cvs.width/2, 0);
        ctx.arc(this.cvs.width/2,this.cvs.height/2,this.cvs.height/2,-3.14/2,alpha-(3.14/2),false);
        ctx.closePath();
        ctx.strokeStyle = this.couleur_centre;
        ctx.fillStyle = this.couleur_progres;
        ctx.shadowColor = this.couleur_ombre;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        //dessin du cercle centrale
        if (this.rotation) {
            ctx.save(); 

            var d=(this.cvs.width/2).toFixed(1);

            ctx.translate(d,d);
            ctx.rotate(this.angle_rotation * (Math.PI/180));
            ctx.drawImage(this.rotat_image, -(this.rotat_image.width/2), -(this.rotat_image.width/2));
            ctx.restore(); 

            this.angle_rotation+=this.vitesse_rotation;

            if (this.angle_rotation>=360) {
                this.angle_rotation=this.angle_rotation-360;
            } 
        }
        else {
            ctx.beginPath();
            ctx.arc(this.cvs.width/2,this.cvs.height/2,(this.cvs.height/2)-this.epaisseur_barre,-0,3.14*2,false);
            ctx.closePath();

            if (this.image) {
                var pattern = ctx.createPattern(this.image, 'no-repeat');
                ctx.fillStyle = pattern;
            }
            else {
                ctx.fillStyle = this.couleur_centre;
            }
            ctx.fill();
        }
    };

    //gestion des evenements pour le deplacement du curseur du son--------------
    cercle_audio.prototype.event_son=function(e) {
        e.stopPropagation();
        var that=this;
        e.preventDefault();   //evite la selection d'element dans le document
        that.sonson(e);
        document.documentElement.addEventListener("mousemove", that.sn, false);
        document.documentElement.addEventListener("mouseup", that.retson, false);
    };

    //gestion des evenements pour arreter le deplacement du curseur du son
    cercle_audio.prototype.no_event_son=function() {
        var that=this;
        document.documentElement.removeEventListener("mousemove", that.sn, false);
        document.documentElement.removeEventListener("mouseup", that.retson, false);
    };

    //definition du niveau de son et de la position du curseur du son
    cercle_audio.prototype.sonson=function(e){
        var coords_left=  this.ctn_vol.getBoundingClientRect().left;
        var setX =e.clientX;
        var distance=this.ctn_vol.offsetWidth;
        var valeur=(setX-coords_left);
        valeur=valeur/distance;

        if(valeur>1) {
            this.audio.volume=1;
            this.ctn_vol.getElementsByTagName('div')[0].style.width=distance+'px';
        } else if(valeur<0) {
            this.audio.volume=0;
            this.ctn_vol.getElementsByTagName('div')[0].style.width=0+'px';
        } else{
            this.audio.volume=valeur;
            this.ctn_vol.getElementsByTagName('div')[0].style.width=(valeur*distance)+'px';
        }
    };

    //sert a deteminer si le temp sera celui ecoule ou le temp restant.
    cercle_audio.prototype.toto=function() {
        this.total===0 ? this.total=1 : this.total=0;
    };

    //affichage de la durée en cours
    cercle_audio.prototype.temp=function() {
        var dura=(this.total===0 ? this.audio.currentTime : this.audio.duration-this.audio.currentTime);

        if (!isNaN(dura)){
            var min = Math.floor(dura / 60);
            if (min < 10) {
                min = '0' + min;
            }
            var sec = Math.floor(dura % 60);

            if (sec < 10) {
                sec = '0' + sec;
            }
            this.tmp.firstChild.nodeValue=min+ ':'+sec;
        }
    };

    //gestion de la fin de lecture d'un titre
    cercle_audio.prototype.fin=function(e){
        if (this.playlist) {
            this.suivant();
        } else {
            this.ma.classList.remove("btn_pause");
            this.ma.classList.add("btn_play");
            clearInterval(this.inter);
        }
    };

    //gestion de la fin de lecture d'un titre
    cercle_audio.prototype.suivant=function(e) {
        this.nombre++;
        if (this.nombre===this.playlist.length) {
            this.nombre=0;
        }
        this.change();
    };

    cercle_audio.prototype.precedent=function(e) {
        this.nombre--;
        if (this.nombre<0) {
            this.nombre=this.playlist.length-1;
        }
        this.change();
    };
	
    cercle_audio.prototype.change=function(e) {
        clearInterval(this.inter);
        this.audio.src=this.playlist[this.nombre].chemin;
        this.audio.load();

        if (this.playlist[this.nombre].image) {
            this.image = new Image();
            this.image.src = this.playlist[this.nombre].image;

            var that = this;

            this.image.onload=function() {
                var cvs=document.createElement("canvas");
                cvs.height= that.diametre;
                cvs.width=that.diametre;

                var ctx=cvs.getContext('2d'); 
                ctx.beginPath();
                ctx.arc(that.rayon,that.rayon,(that.rayon)-that.epaisseur_barre,0,3.14*2,false);
                ctx.closePath();
                var pattern = ctx.createPattern(that.image, 'no-repeat');
                ctx.fillStyle = pattern;
                ctx.fill();

                that.angle_rotation=0;
                that.rotat_image=cvs;
            };

            this.image.onerror=function() {
                that.image=false;
            };
        } else {
            this.image=false;
            this.audio.onloadedmetadata=this.marchearret.bind(this);
            this.audio.onerror=this.erreur.bind(this);
        }
    };
	
    cercle_audio.prototype.erreur=function() {
        this.suivant();
    };

    cercle_audio.prototype.tb_instances=[];

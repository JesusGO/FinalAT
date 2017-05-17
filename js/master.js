var apiKey = 'AIzaSyCieB0v0nZS_6AJqFoscjpV2ioqxG_GPAY';
var objParking=[];
var parkings=[];
var parks=[];
var mycolecciones=[];
var asos=[];
//GOOGLE+
function makeApiCall(userid) {
	gapi.client.load('plus', 'v1', function() {
		var request = gapi.client.plus.people.get({
			'userId': userid,
		});
		request.execute(function(resp) {
			var displayName=resp["displayName"];
			var content='<li class="list-group-item item-drag-user" data-id='+userid+'>'+displayName+'</li>';
			$("#list-users").prepend(content);
			$(function(){
				var $listUs = $("#list-users")
				var $droppableUs = $(".add_user");
				$(".item-drag-user", $listUs ).draggable({
					cancel: "a.ui-icon",
					revert: "invalid",
					containment: "document",
					helper: "clone",
					cursor: "move"
				});
				$droppableUs.droppable({
					accept: "#list-users > .item-drag-user",
					classes: {"ui-droppable-active": "ui-state-highlight"},
					drop: function( event, ui ) {
						var user={
							id:ui.draggable.data('id'),
							name:ui.draggable[0].innerHTML
						}

						parkings[$(this).attr('data')].users.push(user);

						if(!asos.includes($(this).attr('data'))){
							asos.push($(this).attr('data'));
						}


						var content='<li class="list-group-item">'+user.name+'</li>';
						$("#lista_users_parking").prepend(content);
					}
				});
			});
		});
	});
}
function getInfoUsers(userid){
	handleClientLoad(userid);
}
function handleClientLoad(userid) {
	gapi.client.setApiKey(apiKey);
	makeApiCall(userid);
}

//COLECCIONES
function drawParkingsCol(p) {
	var content='<li class="list-group-item item-drag" data-id='+p.id+'>'+p.title+'</li>';
	$('#colecciones #list-pa').prepend(content);
}
function viewParkingsColecciones() {
	for (var i = 0; i < parkings.length; i++) {
		drawParkingsCol(parkings[i]);
	}
}
function drawColecciones(mycoleccion){
	var content='<div class="panel panel-default">\
			<div class="panel-heading" role="tab" id="heading'+mycoleccion.name+'">\
				<h4 class="panel-title">\
					<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+mycoleccion.name+'" aria-expanded="true" aria-controls="collapse'+mycoleccion.name+'">\
					'+mycoleccion.name+'\
					</a\
				</h4>\
				<input type="radio" class="radio_cole" name="inlineRadioOptions" id="inlineRadio1" value="'+mycolecciones.length+'">\
			</div>\
			<div id="collapse'+mycoleccion.name+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading'+mycoleccion.name+'">\
				<div class="panel-body">\
				<div class="col-md-6">\
				<ul id="list-cole-id-'+mycoleccion.id+'" class="list-group">';
				for (var i = 0; i < mycoleccion.parkings.length; i++) {
					var idp= mycoleccion.parkings[i].p.id;
					content +='<li class="list-group-item btn-insta" data-id="'+idp+'">'+mycoleccion.parkings[i]["name"]+'</li>';
				}
				content +='</ul></div>\
				<div class="col-md-6 box-drop droppable-box" data-id="'+mycoleccion.id+'"><i class="fa fa-plus" aria-hidden="true"></i></div>\
				</div>\
			</div>';
	$("#mycolec").prepend(content);
	$("#list-pa-added").html("");
	$("#NaCol").val("");
	mycolecciones.push(mycoleccion);
	parks=[];
	$(function(){
		var $droppablebox = $(".droppable-box");
		$droppablebox.droppable({
			accept: "#list-pa > .item-drag",
			classes: {"ui-droppable-active": "ui-state-highlight"},
			drop: function( event, ui ) {
				var parkfull=parkings[ui.draggable.data('id')];
				var park={
					p:parkfull,
					name:ui.draggable[0].innerHTML
				}
				//var c={
				//	id:ui.draggable.data('id'),
				//	name:ui.draggable[0].innerHTML
				//}


				var id=$(this).data('id');
				mycolecciones[id].parkings.push(park);

				var content='<li class="list-group-item item-drag data-id='+ui.draggable.data('id')+'">'+ui.draggable[0].innerHTML+'</li>';
				$("#list-cole-id-"+id+"").prepend(content);
			}
		});
	});






}
///INSTALACIONES
function viewParkingInst(id){
	$("#insta_id").attr("data",id);
	$("#insta-title").text(parkings[id].title);
	$("#insta-street").text(parkings[id].street);
	$("#insta-loca").text(parkings[id].locality);
	$("#insta-lat").text(parkings[id].lat);
	$("#insta-long").text(parkings[id].long);
	$("#insta-postal").text(parkings[id].postal);
	$("#insta-desc").text(parkings[id].description);
	$("#insta-indi .indi").remove();
	$("#insta-images .item").remove();
	var indiInit='<li class="indi active" data-target="#carousel-example-generic" data-slide-to="'+ 0 +'"></li>';
	var imageInit='<div class="item active">\
								<img src="'+parkings[id].images[0]+'" alt="...">\
								<div class="carousel-caption">\
								</div>\
							</div>';
	$("#insta-images").prepend(imageInit);
	$("#insta-indi").prepend(indiInit);

	$("#lista_users_parking").html("");
	for (var j = 0; j < parkings[id].users.length; j++) {

		var content='<li class="list-group-item">'+parkings[id].users[j].name+'</li>';
		$("#lista_users_parking").prepend(content);
	}
	for (var i = 1; i < parkings[id].images.length; i++) {
		var url_image=parkings[id].images[i];
		var indi='<li class="indi" data-target="#carousel-example-generic" data-slide-to="'+i+'" class=""></li>';
		var images='<div class="item ">\
									<img src="'+url_image+'" alt="...">\
									<div class="carousel-caption">\
									</div>\
								</div>';
		$("#insta-indi").prepend(indi);
		$("#insta-images").prepend(images);


	}


}
function viewParkingMain(id) {
	$("#info-main").css('display','inherit');
	$("#main-title").text(parkings[id].title);
	$("#main-street").text(parkings[id].street);
	$("#main-indi .indi").remove();
	$("#main-images .item").remove();
	var indiInit='<li class="indi active" data-target="#carousel-example-generic" data-slide-to="'+ 0 +'"></li>';
	var imageInit='<div class="item active">\
								<img src="'+parkings[id].images[0]+'" alt="...">\
								<div class="carousel-caption">\
								</div>\
							</div>';
	$("#main-images").prepend(imageInit);
	$("#main-indi").prepend(indiInit);
	for (var i = 1; i < parkings[id].images.length; i++) {
		var url_image=parkings[id].images[i];
		var indi='<li class="indi" data-target="#carousel-example-generic" data-slide-to="'+i+'" class=""></li>';
		var images='<div class="item ">\
									<img src="'+url_image+'" alt="...">\
									<div class="carousel-caption">\
									</div>\
								</div>';
		$("#main-indi").prepend(indi);
		$("#main-images").prepend(images);
	}
}


/////MAPA
function loadMap(mymap){
	mymap.setView([51.505, -0.09], 13);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(mymap);
}
function putInMap(id,mymap){
	var lat=parkings[id].lat;
	var long=parkings[id].long;
	var title=parkings[id].title;
	mymap.setView([lat, long], 13);
	var marker=L.marker([lat, long]);
	var link = $('<div class="text-center popup">'+title+'<br><a href="#" class="speciallink">Borrar</a></div>').click(function() {
    mymap.removeLayer(marker);
		$("#info-main").css('display','none');
		$("#nav-insta").addClass('disabled');
	})[0];
	marker.addTo(mymap)
	.bindPopup(link).openPopup().on('click', function(marker) {
		viewParkingInst(id);
		viewParkingMain(id);
		$("#nav-insta").removeClass('disabled');
	});
}


///CONSEGUIR LOS DATOS DEL AYUNTAMIENTO Y MOSTRARLOS EN PANTALLA
function draw(p){
	var content='<div class="col-xs-6 col-sm-4 col-md-4">\
    <div class="thumbnail nopad">\
      <img src="'+p.image_main+'" alt="...">\
      <div class="caption nopad">\
        <h3 class="text-center">'+p.title+'</h3>\
        <div class="btn-group btn-group-justified" role="group" aria-label="...">\
          <div class="btn-group" role="group">\
            <button type="button" class="btn-insta btn btn-thumbnail"\
              data-id="'+p.id+'">\
            <i class="fa fa-map-marker" aria-hidden="true"></i></i>\
            </button>\
          </div>\
      </div>\
    </div>\
  </div>';
  $('#parking').prepend(content);
}
function getIMagesFromPark(i,park) {
	var lat=park.lat;
	var long=park.long;
	park["id"]=i;
	$.ajax({
		url: "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord="+lat+"|"+long+"&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?",
		jsonp: "callback",
		dataType: "jsonp",
		async:false,
		success: function( response ) {
			var query=response["query"];
			var array_img=[];
	    if (response["query"]!=undefined && response["query"]["pages"]!=undefined) {
				var pages=response["query"]["pages"];
				var array_images = $.map(pages, function(el) { return el });
				var url_image_main=array_images[0]["imageinfo"][0].url;

				park["image_main"]=url_image_main;
				for (var i = 0; i < array_images.length; i++) {
					array_img.push(array_images[i]["imageinfo"][0].url);
				}
				park["images"]=array_img;
				draw(park);
	    }
		}
	});
}
function getImages(i,park){
	getIMagesFromPark(i,park);
}
function getImagesOfParkings(){
	for (var i = 0; i < parkings.length; i++) {
		getImages(i,parkings[i]);
	}
}
function getInfoOfParkings() {
	for(var i=0;i<objParking.length;i++){
		var object=objParking[i].obj;
		var objtitle=object.title.split(".");
		var title=objtitle[1];
		var lat=objParking[i].lat;
		var long=objParking[i].long;
		var locality=object["address"].locality;
		var street=object["address"]["street-address"];
		var postal=object["address"]["postal-code"];
		var description=object["organization"]["organization-desc"];
		var parking={
			id:null,
			title:title,
			lat:lat,
			long:long,
			users:[],
			locality:locality,
			street:street,
			image_main:null,
			images:null,
			postal:postal,
			description:description
		}
		parkings.push(parking);
	}
}
function getObjParkingsFromJson(){
	$.ajax({
		url: "json/data.json",
		beforeSend:function(xhr){
			$(".icon-download").css('display','none');
			$(".icon-loading").css('display','inherit');
		},
		async:false,
		success:function(data) {
			var objData=data["@graph"];
			for (var i = 0; i < objData.length; i++){
				var location=objData[i]["location"];
				if (location!=undefined) {
					var lat=location.latitude;
					var long=location.longitude;
					var obj={
						obj:objData[i],
						lat:lat,
						long:long
					}
					objParking.push(obj);
				}
			}
			return;
		}
	});
}

//GITHUB
function loadFileGithub() {
	var fich=$("#inputFichload").val();

	var gh = new Github("JesusGO", "AT");

	var repo=gh.getRepo("JesusGO", "AT");



	repo.read('master',fich, function(e, data) {
		var obj;
		obj=JSON.parse(data);

		for (var j = 0; j < obj.as.length; j++){
			console.log(obj.as[j].id);
			var idpa=parseFloat(obj.as[j].id);
			parkings[idpa].users=obj.as[j].users

		}

		for (var i = 0; i < obj.col.length; i++) {
			var mycoleccion={
				id:mycolecciones.length,
				name:obj.col[i].name,
				parkings:obj.col[i].parkings
			}
			drawColecciones(mycoleccion);

		}
	});

}
function saveFileGithub() {
	var token=$("#inputToken").val();
	var repo=$("#inputRepo").val();
	var fich=$("#inputFich").val();
	if(token=="" || repo=="" || fich==""){
		alert("Rellenar todos los campos");
		return;
	}
	var arrayasos=[];


	for (var x = 0; x < asos.length; x++) {
		var asociacion={
			id:asos[x],
			users:parkings[asos[x]].users
		}
		arrayasos.push(asociacion);
	}

	var send={
		col:mycolecciones,
		as:arrayasos
	}
	var myJSON = JSON.stringify(send, null, 2);

	var gh = new Github({
		token : token,
		auth : "oauth"
	});

	var repo=gh.getRepo("JesusGO", repo);

	repo.write('master', fich+".json", myJSON, "Probando funcion", function(e) {
		console.log(e);
	});
}


$(document).ready(function(){
	var mymap = L.map('mapid');

	$("#btn_load").click(function(){
		loadFileGithub();
	});
	$("#btn_save").click(function(){
		saveFileGithub();
		$("#inputToken").val('');
		$("#inputRepo").val('');
		$("#inputFich").val('');

	});


	$('#download').click(function(event){
		getObjParkingsFromJson();
		getInfoOfParkings();
		getImagesOfParkings();
		$("#welcome").css('display','none');
		$("#cover").css('display','none');
		$("#list").css('display','inherit');
		$("#mapid").css('display','inherit');
		$("#parking").css('display','inherit');
		$("#btn-colections").css('display','inherit');
		$("#nav-cole").removeClass('disabled');
		loadMap(mymap);
	});

	$(document).on("click", ".btn-insta", function (){
		$("#nav-insta").removeClass('disabled');
		var id=$(this).data('id');
		viewParkingInst(id);
		viewParkingMain(id);
		putInMap(id,mymap);
	});


	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var target = $(e.target).attr("href");
		switch (target) {
			case "#colecciones":
				$("#btn-colections").css('display','none');
				viewParkingsColecciones();
				$(function(){
					var $listAp = $("#list-pa")
					var $droppable = $(".droppable");
					$(".item-drag", $listAp ).draggable({
						cancel: "a.ui-icon",
						revert: "invalid",
						containment: "document",
						helper: "clone",
						cursor: "move"
					});
					$droppable.droppable({
						accept: "#list-pa > .item-drag",
						classes: {"ui-droppable-active": "ui-state-highlight"},
						drop: function( event, ui ) {
							var parkfull=parkings[ui.draggable.data('id')];
							var park={
								p:parkfull,
								name:ui.draggable[0].innerHTML
							}
							var content='<li class="list-group-item item-drag data-id='+ui.draggable.data('id')+'">'+ui.draggable[0].innerHTML+'</li>';
							$("#list-pa-added").prepend(content);
							parks.push(park);
						}
					});
				});
				break;
			case "#aparcamientos":
				$("#btn-colections").css('display','inherit');
				break;
			case "#instalaciones":
				/*$("#lista_users_parking").html("");
				var id=$("#insta-id").data('id',id);
				for (var i = 0; i < parkings[i].users.length; i++) {
					var content='<li class="list-group-item">'+parkings[i].users[i].name+'</li>';
					$("#lista_users_parking").prepend(content);
				}*/
				break;
			default:
		}
	});


	$("#submit-add-colec").click(function(){
		if ($("#NaCol").val()!=''){
			var mycoleccion={
				id:mycolecciones.length,
				name:$("#NaCol").val(),
				parkings:parks
			}
			drawColecciones(mycoleccion);


		}else{
			alert("Rellenar Nombre");
		}
	});


	$('#btn-colections').click(function(){
		$("#modal-cole-main").html("");
		var pos=$('input[type=radio]:checked').val();
		if(pos!=undefined){
			var content='<div class="panel panel-default">\
										<div class="panel-heading">\
											<h3 class="panel-title">'+mycolecciones[pos].name+'</h3>\
										</div>\
										<div class="panel-body">\
										<ul class="list-group">';
											for (var j = 0; j < mycolecciones[pos].parkings.length; j++) {
												content+='<li class="list-group-item btn-insta" data-id="'+mycolecciones[pos].parkings[j].p.id+'">'+mycolecciones[pos].parkings[j].name+'</li>';
											}
										content+='</div></ul>\
									</div>';
			$('#modal-cole-main').prepend(content);
		}else{
			$('#modal-cole-main').prepend('<h2 class="info-msg text-center">Ninguna Colección Selecionada</h2>');
		}
	});

	$('#search_google').on('click', function () {
		$("#spinner_users").css('display','inherit');
		$("#search_google").css('display','none');
		$("#list-users").html("");
		var userid=[];
		try {
			var host = "ws://127.0.0.1:80";
			console.log("Host:", host);
			var s = new WebSocket(host);
			s.onopen = function (e) {
				console.log("Socket opened.");
			};
			s.onclose = function (e) {
				console.log("Socket closed.");
				$("#spinner_users").css('display','none');
				$("#search_google").css('display','inherit');
			};
			s.onmessage = function (e) {
				if(userid.includes(e.data)){
					if(userid.length==12){
						s.close();
					}
					return;
				}
				userid.push(e.data);
				getInfoUsers(e.data);
			};
			s.onerror = function (e) {
				console.log("Socket error:", e);
			};
		} catch (ex) {
			console.log("Socket exception:", ex);
		}
	});

});

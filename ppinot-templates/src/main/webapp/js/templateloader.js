var activityNames = [];
var activityNameId = {};
var activityIdName = {};
var activityStates = ["Start", "Cancel","End"];
var DataObjectNames= [];
var DataObjectState= [];
var eventNames = [];
var aggregates=[];

function isActivity(id) {
	var result = false;

	if (typeof activityIdName[id] != "undefined")
		result = true;

	return result;
}

function findPosition(ar, name) {
	var pos = -1;
	var j = 0;
	while (j < ar.length) {
		if (ar[j] == name) {
			pos = j;
			break;
		}
		j++;
	}

	return pos;
}


function loadAll(processName) {
	$.ajax({
		type: "GET",
		url: "/api/repository/processes/" + processName + "/activities",
		dataType: "json",
		success: function(data) {
			$(data).each(function (index) {
				if (this.name == "") {
					this.name = this.id;
				}
				activityNames.push(this.name);
				activityIdName[this.id] = this.name;
				activityNameId[this.name] = this.id;				
			});
			loadEvents(processName);
		}
	});
}

function loadEvents(processName) {
	$.ajax({
		type: "GET",
		url: "/api/repository/processes/" + processName + "/events",
		dataType: "json",
		success: function(data) {
			$(data).each(function (index) {
				if (this.name == "") {
					this.name = this.id;
				}
				activityNames.push(this.name);
				activityIdName[this.id] = this.name;
				activityNameId[this.name] = this.id;	
				
			});
			loadDataObjects(processName);
		}
	});
}

function loadDataObjects(processName) {
	$.ajax({
		type: "GET",
		url: "/api/repository/processes/" + processName + "/dataobjects",
		dataType: "json",
		success: function(data) {
			$(if (this.name == "") {
				this.name = this.id;
			}
			activityNames.push(this.name);
			activityIdName[this.id] = this.name;
			activityNameId[this.name] = this.id;	
			});
			loadGateways(processName);
		}
	});
}

function loadGateways(processName) {
	$.ajax({
		type: "GET",
		url: "/api/repository/processes/" + processName + "/gateways",
		dataType: "json",
		success: function(data) {
			$(data).each(function (index) {
				if (this.name == "") {
					this.name = this.id;
				}
				activityNames.push(this.name);
				activityIdName[this.id] = this.name;
				activityNameId[this.name] = this.id;	
			});
			loadTemplates(processName);
		}
	});
}


function loadTemplates(processName) {
	$.ajax({
		type: "GET",
		url: "/api/repository/processes/" + processName + "/ppis",
		dataType: "json",
		success: function(data) {
			$(data).each(function (index) {
				if (this.name == "") {
					this.name = this.id;
				}
				activityNames.push(this.name);
				activityIdName[this.id] = this.name;
				activityNameId[this.name] = this.id;	
				loadTemplate(this);
			});
		}
	});
}



function loadTemplate(ppi) {
	// carga plantilla
	var elem = $("#container");

	var measuredByElem = $("<div></div>");
	var targetElem = $("<div></div>");

	measuredByElem.appendTo(elem);
	targetElem.appendTo(elem);

	loadMeasuredBy(measuredByElem, ppi.measuredBy);
	loadTarget(targetElem, ppi.target);
}

function loadMeasuredBy(elem, measuredBy) {loadMeasure(measureBy);}
	
	
function loadMeasure(measureBy){
    var kindIndex = {
    	TimeInstanceMeasure: 0,
		CountInstanceMeasure: 1,
		StateConditionMeasure: 2,
		DataPropertycondition: 3,
		DataMeasure: 4,
		AggregatedMeasure: 5,
		DerivedMeasure: 6
    };

    var kindContained = {
    	TimeInstanceMeasure: containedTimeInstanceMeasure,
    	CountInstanceMeasure: containedCountInstanceMeasure,
    	StateConditionMeasure: containedStateConditionInstanceMeasure,
    	DataPropertycondition: containedDataPropertycondition,
    	DataMeasure: containedDataInstanceMeasure,
    	AggregatedMeasure: containedAggregatedMeasure,
    	DerivedMeasure: containedDerivedInstanceMeasure
    };

    var load = {
    	value: kindIndex[measuredBy.kind],
    	contained: kindContained[measuredBy.kind](measuredBy)
    };

    // Completarlo para el resto de measures

    console.log(load);

	elem.linguisticPattern("The PPI is defined as", measureOptions, load);

}

function containedTimeInstanceMeasure(measuredBy) {
	var contained = {
		startEvent: containedEvent(measuredBy.from),
		endEvent: containedEvent(measuredBy.to)
	};

	return contained;
}

function containedCountInstanceMeasure(measuredBy) {
	var contained = {
		event: containedEvent(measuredBy.when)
	};
	return contained;
}

function containedEvent(event) {
	var contained = {};

	if (isActivity(event.appliesTo)) {
		contained.value = 0;
		contained.activityNames = {
			value: containedActivityNames(event)
		};		
		contained.activityState = {
			value: findPosition(activityStates, event.changesToState.stateString)
		};
	}

	// Completarlo salvo para el tipo "process"

	console.log(contained);

	return contained;
		
}

function containedActivityType(event){
	var contained = {
			value: findPosition(activityNames, activityIdName[event.id])
	};
	console.log(contained);

	return contained;
}
function containedActivityNames(event){
	var contained = {
			value: findPosition(activityNames, activityIdName[event.appliesTo])
	};
	console.log(contained);

	return contained;
}

function containedActivityState(event){
	var contained = {
			value: findPosition(activityStates, event.changesToState.stateString)
	};
	console.log(contained);

	return contained;
}

function containedStateConditionInstanceMeasure(measuredBy){
  var contained={
		  activityType: containedActivityType(measuredBy.Id),
		  activityName: containedActivityNames(measuredBy.appliesTo),
		  activityState: containedActivityState(measuredBy.changesToState.stateString),
		  state:  containedState(measuredBy)
  }
 
  console.log(contained);
     return contained;
}

function containedState(event){
	  var contained={
			  activityType: containedActivityType(event),
			  activityName: containedActivityNames(event),
			  activityState: containedActivityState(event),
			  
	  }
	 
	  console.log(contained);
	     return contained;
	}
}
function containedDataPropertycondition(measuredBy){
	var contained={
			DataObjectName: containedDataObjectName(measuredBy.groupBy.dataObject),
			ConditionDataObjectPropertie: containedConditionDataObjectProperty(measuredBy.groupBy.dataObjectId)
			
	}
	console.log(contained);
    return contained;
}

function containedDataObjectName(measuredBy){
	var contained={
			value: findPosition(measuredBy, DataObjectNames[measuredBy.groupBy.dataObject])
	}
	console.log(contained);
    return contained;
}

function ConditionDataObjectPropertie(measuredBy){
	var contained={
			value: findPosition(measuredBy, DataObjectNames[measuredBy.groupBy.dataObjectId])
	}
	console.log(contained);
    return contained;
}

function containedDataInstanceMeasure(measuredBy){
	DataObjectPropertyName: containedDataObjectPropertyName(measuredBy.groupBy.dataObject),
	DataObjectName: containedDataObjectName(measuredBy.groupBy.dataObject),
	
}



function containedAggregatedMeasure(measuredBy) {
	var contained={
			Aggregate: containedAggregate(measuredBy.aggregationFunction),
			MeasureForAgg: loadMeasure(measureBy),
			DataObjectPropertyName: containedDataObjectPropertyName(measureBy.groupBy.dataObject),
			DataObjectName: containedDataObjectName(measureBy.groupBy.dataObject)
	}
	console.log(contained);
    return contained;
}

function containedAggregate(measuredBy){
	var contained={
			value: findPosition(measuredBy, aggregates[measuredBy.aggregationFunction])
	}
	console.log(contained);
    return contained;
}
function DataObjectPropertyName(measureBy){
	var contained={
			value: findPosition(measuredBy, DataObjectNames[measuredBy.groupBy.dataObject])
	}
	console.log(contained);
    return contained;
}

function ContainedDerivedInstanceMeasure(measuredBy){
	var contained={
			expresion: "",
			parametros:	"",
			MeasureForDer: loadMeasure(measureBy),
			
	}
	console.log(contained);
    return contained;
}

function loadTarget(elem, target){
	var kindIndex = {
			minRef: 0,
			maxRef: 1,
			minequalRef: 2,
			maxequalRef: 3,
			
	    };

	    var kindContained = {
	    		minRef: containedMinRef,
	    		maxRef: containedMaxRef,
	    		minequalRef: containedMinEqualRef,
	    		maxequalRef: containedMaxEqualRef,
	    };

	    var loadTarget = {
	    	value: kindIndex[target.kind],
	    	contained: kindContained[target.kind](target)
	    };

		elem.linguisticPattern("The PPI value must", options, loadTarget);
}

function containedMinRef(){
	var contained={
		value:0	
	}
	console.log(contained);
    return contained;
}

function containedMaxRef(){
var contained={
		value:1	
	}
	console.log(contained);
    return contained;
}

function containedMinEqualRef(){
var contained={
		value:2
	}
	console.log(contained);
    return contained;
}

function containedMaxEqualRef(){
     var contained={
    		 value:3	
	}
	console.log(contained);
    return contained;
}



	

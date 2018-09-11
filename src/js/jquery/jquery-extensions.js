
/* global jQuery $ */
jQuery.prototype.classOp = function(op, className){
	const fn = op === -1 ? 'removeClass'
		: op === 0 ? 'toggleClass'
		: op === 1 ? 'addClass'
		: false;
	if(fn){
		$(this)[fn](className);
    }
};
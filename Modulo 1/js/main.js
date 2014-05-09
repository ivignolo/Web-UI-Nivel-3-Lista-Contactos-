require(['jquery','underscore','backbone','handlebars'],function($){

	var Contact = Backbone.Model.extend({
		initialize : function(){
			this.on('invalid',function(model,error){
				alert(error);
			});
		},
		defaults: function(){
			return{
				name : '',
				surname : '',
				phone : '',
				email : ''
			}
		},
		validate: function(attributes){
			if(!attributes.name || !attributes.surname || !attributes.phone || !attributes.email){
				return 'Por favor llenar todos los datos del formulario.';
			}
		}
	});

	var ContactList = Backbone.Collection.extend({
		model: Contact
	});

	var contactList = new ContactList();

	var ContactView = Backbone.View.extend({
		model : new Contact(),
		tagName : 'li',
		events: {
			'click .edit': 'edit',
			'click .delete': 'delete',
			'blur .name': 'close',
			'keypress .name': 'onEnterUpdate'
		},
		initialize: function(){
			/*UNDERSCORE*/
			//this.template = _.template($('#contactTemplate').html());
			/*UNDERSCORE*/
			
			/*HANDLEBARS*/
			var source   = $("#contactTemplate").html();
			this.template = Handlebars.compile(source);
			/*HANDLEBARS*/
		},
		edit: function(ev) {
			ev.preventDefault();
			this.$('.name').attr('contenteditable', true).focus();
		},
		close: function(ev) {
			var name = this.$('.name').text();
			this.model.set('name', name);
			this.$('.name').removeAttr('contenteditable');
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.close();
				self.$('.name').blur();
			}
		},
		delete: function(ev) {
			ev.preventDefault();
			contactList.remove(this.model);
		},
		render: function(){
			/*UNDERSCORE*/
			//this.$el.html(this.template(this.model.toJSON()));
			/*UNDERSCORE*/
			
			/*HANDLEBARS*/
			var context = this.model.toJSON();
			this.$el.html(this.template(context));
			/*HANDLEBARS*/
			
			return this;
		}
	});

	var ContactsView = Backbone.View.extend({
		model : contactList,
		el: $('#contacts-container'),
		initialize: function () {
			this.model.on('add', this.render, this);
			this.model.on('remove', this.render, this);
		},
		render: function(){
			var self = this;
			self.$el.html('');
			this.model.each(function(contact, i){
				self.$el.append((new ContactView({model: contact})).render().$el);
			});
			return this;
		}
	});

	$(document).ready(function(){
		$('#contactForm').submit(function(){
			var contact = new Contact();
			contact.set({name: $('#name').val(),surname: $('#surname').val(), email: $('#email').val(), phone: $('#phone').val()});

			if(contact.isValid()){
				contactList.add(contact);
			}	
			//Imprimo lista en consola
			console.log(JSON.stringify(contactList));
			return false;
		});
		contactList.fetch({ url: "data/init.json"});
		var appView = new ContactsView();
	});
	
});


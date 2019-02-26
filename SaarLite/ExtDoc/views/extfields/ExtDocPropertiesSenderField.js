Ext.define('ExtDoc.views.extfields.ExtDocPropertiesSenderField', {
	mixins: [ 'ExtDoc.views.extfields.ExtDocField' ],
	extend: 'ExtDoc.views.extfields.ExtDocTextField',
	requires: 'ExtDoc.utils.ExtDocObjectPermissionUtils',
	editable: true,
	xtype: "textfield",
	regex: ExtDoc.utils.ExtDocObjectPermissionUtils.getSenderNameRegEx(),
	invalidText: ExtDoc.locales.ExtDocLocaleManager.getText('invalid_input_allowed_characters_letters_digits_spaces_underscores')//"Invalid input. Only letters and numbers allowed.",
});

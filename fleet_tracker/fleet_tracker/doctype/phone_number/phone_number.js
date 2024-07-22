frappe.ui.form.on("Phone Number", {
	phone_number(frm) {
        // frm.doc.phone_number
        frm.set_value('route', frm.doc.phone_number)

	},
});
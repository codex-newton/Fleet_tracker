# Copyright (c) 2024, Isaac Newton (codex-newton) and contributors
# For license information, please see license.txt

# import frappe
from frappe.website.website_generator import WebsiteGenerator
from frappe.model.document import Document

class PhoneNumber(WebsiteGenerator):
	def before_save(self):
		if self.phone_number:
			self.route = self.phone_number


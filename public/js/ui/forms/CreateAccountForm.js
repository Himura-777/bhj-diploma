/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
	/**
	 * Создаёт счёт с помощью Account.create и закрывает
	 * окно в случае успеха, а также вызывает App.update()
	 * и сбрасывает форму
	 * */
	onSubmit(data) {
		Account.create(data, response => {
			if (response && response.success) {
				this.element.reset();

				App.setState("user-logged");

				const modalId = this.element.closest(".modal").dataset.modalId;
				App.getModal(modalId).close();
			}
		});
	}
}

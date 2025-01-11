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

				const modal = this.element.closest(".modal");
				if (modal) {
					Modal.close(modal.id);
				}
			} else {
				throw new Error("Ошибка");
			}
		});
	}
}

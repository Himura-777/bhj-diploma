/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
	/**
	 * Производит регистрацию с помощью User.register
	 * После успешной регистрации устанавливает
	 * состояние App.setState( 'user-logged' )
	 * и закрывает окно, в котором находится форма
	 * */
	onSubmit(data) {
		User.register(data, (err, response) => {
			if (response && response.success) {
				this.element.reset();

				App.setState("user-logged");

				const modalId = this.element.closest(".modal").dataset.modalId;
				App.getModal(modalId).close();
			}
		});
	}
}

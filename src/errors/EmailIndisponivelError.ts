class EmailIndisponivelError extends Error {

  constructor() {
    super("Já existe um cadastro para este e-mail!");
    this.name = "EmailIndisponivelError";
  }
}

export { EmailIndisponivelError };

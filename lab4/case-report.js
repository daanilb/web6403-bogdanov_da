class CaseReport {
  constructor(fields) {
    this.caseNumber = Number(fields.get('caseNumber'));
    this.message = fields.get('message').trim();
    this.confirmed = fields.has('confirmed');
  }

  printToConsole() {
    console.table(this);
  }
}

module.exports = async function ready() {
  while (this.ws.status != 0) await this.functions.sleep(10);
  return !this.application.name ? this.application.fetch() : this.application;
};
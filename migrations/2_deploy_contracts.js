var defiProtocol = artifacts.require("defiProtocol");

module.exports = function(deployer) {
  deployer.deploy(defiProtocol);
};

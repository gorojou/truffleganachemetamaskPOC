App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load defi.
    $.getJSON('../defi.json', function(data) {
      var petsRow = $('#DeFiRow');
      var petTemplate = $('#DefiTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.defi-resume').text(data[i].resume);
        petTemplate.find('.defi-prod').text(data[i].products);
        petTemplate.find('.btn-get').attr('data-id', data[i].id);
        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // get web3.js - exp: Chrome w. MetaMask provides its own web3.js
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
    }else{
      // if no browser web3 instance is found, use web3.js in ganache
      //�NOTE: not suitable for production!
      // NOTE: web3Provider=null is member of App
      App3.web3Provider = new
        Web3.providers.HttpProvider('http://localhost:7545');
    }

    // initialize contract by App function below
    return App.initContract();
  },

  initContract: function() {
    // get contract artifact file - instantiate it with truffle-contract
    // artifacts is a JSON file containing contract's deployed address
    // and ABI file (like IDL signatures file)
    $.getJSON('defiProtocol.json', (data)=> {
      var defiProtocolArtifact = data;

      // pass the retrieved artifacts to TruffleContract to instantiate it
      // NOTE: contracts={} is a member of App
      App.contracts.defiProtocol = TruffleContract(defiProtocolArtifact);

      // once contract is instantiated, set the provider for the contract
      // NOTE: web3Provider=null is member of App
      App.contracts.defiProtocol.setProvider(App.web3Provider);

      // use contract to retrieve petId, see if the pet is already adopted,
      // and if not, mark the pet as adopted
      // see App.markedAdopted() below
      return App.markDefi();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-get', App.handleAdopt);
  },

  markDefi: function(users, account) {
    var adoptionInstance;

    // deploy the instantiated contract - when deployed get the 'instance'
    // address of the deployed contract - set adoptionInstance with it
    App.contracts.defiProtocol.deployed().then(function(instance) {
      defiProtocolInstance = instance;

      // using call() allows us to read from the blockchain without sending
      // a full transaction - so no gas cost 
      // return the collection of adopters and after promise resolution
      // iterate through them
      return defiProtocolInstance.getdefi.call();
    }).then(function(users) {
      // check for all adoptors to see if address is non-trivial, i.e. not
      // 0x000 (assigned by Solidity to each array on initialization)
      // If the address in NOT 0x000 then the pet has already been adopted,
      // so disable its adopt button, and change the button text to 'Success'
      for (i = 0; i < users.length; i++) {
        if (users[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();
    var defiId = parseInt($(event.target).data('id'));
    var defiProtocolInstance;

    // use web3 to get the user's accounts - if no error, set var account
    // to the first account (the one used in ganache)
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
       console.log(error);
      }
      var account = accounts[0];

      // deploy the instantiated contract - when deployed get the 'instance'
      // address of the deployed contract - set defiProtocolInstance with it
      App.contracts.defiProtocol.deployed().then(function(instance) {
        defiProtocolInstance = instance;

        // different from App.markedAdopted which used call(), this time we
        // send a transaction (so pay gas fees)
        // Thus we need a 'from' account from which to take the gas fee
        // in addition to the petId of the pet desired to be adopted
        // adopt sends the transaction
        // the resolved Promise returns the transaction object 'result'
        return defiProtocolInstance.defi(defiId, {from: account});
      }).then(function(result) {
        // sync the UI with the new adoption - i.e mark pet as adopted
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};//App

$(function() {
  $(window).load(function() {
    App.init();
  });
});

pragma solidity ^0.5.16;

// import global truffle files (there is no truffle directory!)
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";   // import contract to be tested

contract TestAdoption {
  // get address of contract Adoption from DeployedAddresses
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  // test Adoption.adopt(uint petId) - should return petId
  function testUserCanAdoptPet() public {
    uint returnedId = adoption.adopt(8);  // let petId = 8
    uint expected = 8;

    Assert.equal(returnedId, expected, "error: returnedId should have been 8!");
  }

  // test retrieval of a pet's owner - should return this (TestAdoption address)
  function testGetAdopterAddressByPetId() public {
    address adopter = adoption.adopters(8);  // use petId = 8
    address expected = address(this);

    Assert.equal(adopter, expected, "error: owner address is not 'this' test contract!");
  }

  // test retrieval of all pet owners - then get addrees[8]
  // should return this (TestAdoption address)
  function testGetAdopterAddressByPetIdInArray() public {
    address[16] memory adopters = adoption.getAdopters();  // NOTE:'memory'
    address expected = address(this);

    Assert.equal(adopters[8], expected, "error: owner address is not 'this' test contract!");
  }
}//TestAdoption




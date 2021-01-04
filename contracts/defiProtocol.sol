pragma solidity ^0.5.16;


contract defiProtocol {
  address[16] public users;   // array of 16 addresses
                                // public vars have get method - but by index!

  // specify types of arg(s) AND return, and specify function access
  function defi(uint defiId) public returns (uint) {
    require(defiId >= 0 && defiId <=15);   // precondition on arg
    users[defiId] = msg.sender;       // set to address of caller
    return defiId;                      // must return correct type
  }

  // provide get for entire adopters array
  // view is state mutability attrb - the scope of change the function is
  // allowed to make to the Ethereum global state:
  // 'view' functions only return values and do not modify state in any way
  // 'pure' functions are evn more restrictive - they cannot even read the
  // current state
  function getdefi() public view returns ( address[16] memory) {
    return users;
  }
}//DefiUser




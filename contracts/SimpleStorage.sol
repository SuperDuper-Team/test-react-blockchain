// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  uint storedData;
  string name = "Hola";

  function set(uint x) public {
    storedData = x;
  }

  function getName() public view returns (string memory){
    return name;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}

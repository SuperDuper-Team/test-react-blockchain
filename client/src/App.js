import React, { Component, useEffect, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";


const App = () => {
  const [storageValue, setStorageValue] = useState( 0 );
  const [contract, setContract] = useState( null );
  const [web3, setWeb3] = useState( null );
  const [accounts, setAccounts] = useState( [] );
  // eslint-disable-next-line
  useEffect( () => {  
    getWeb3().then(
      res => {
        console.log(res);
        setWeb3( res )
      }
    )
    .catch(
      err => console.log(err)
    )
  }, [])

  useEffect( () => {
    if( !web3 ){
      return
    } 
    console.log( web3 );
    web3.eth.getAccounts().then( res => setAccounts( res ) )
    .catch( err => console.log(err) )
  }, [web3])

  useEffect(  () => {
    if( !web3 || accounts.length == 0 ) return 
    console.log( accounts );
    web3.eth.getId().then(
      networkId => {
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance =  new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract( instance )
      }

    )
    .catch(
      err => console.log(err)
    )
  }, [accounts])

  const getStore = async () => {
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    // Update state with the result.
    return parseInt( response );
  }

  const add = async ( num ) => {
    await contract.methods.set( storageValue + num ).send( { from: accounts[0] } );
    
    const response = await contract.methods.get().call();

    setStorageValue(  parseInt(response) )
  }

  if(!web3) {
    return(
      <div>
        hola...
      </div>
    )
  }

  return (
    <div className='App' >
      <button onClick={ () => add( 1 ) }>
        +1
      </button>
      <button onClick={ () => add( -1 )  }>
        -1
      </button>
      <div>
        Ether: {storageValue }
      </div>
      <div>
        { console.log( contract ) }
      </div>
    </div>
  );

}

/*class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.

    
  };

  add = async ( num ) => {
    const { accounts, contract } = this.state;

    await contract.methods.set( this.state.storageValue + num ).send( { from: accounts[0] } );
    
    const response = await contract.methods.get().call();

    this.setState( { storageValue:  parseInt(response) } )
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <button onClick={ () => this.add( 1 ) }>
           +1
        </button>
        <button onClick={ () => this.add( -1 )  }>
          -1
        </button>
        <div>
          Ether: { this.state.storageValue }
        </div>
      </div>
    );
  }
}*/

export default App;

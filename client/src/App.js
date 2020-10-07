import React, { Component, useState, useEffect  } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";


const App = () => {
  const [web3, setWeb3] = useState( null );
  const [contract, setContract] = useState( null );
  const [storageValue, setStorageValue] = useState( 0 );
  const [accounts, setAccounts] = useState( [] );


  useEffect(() => {
    const fetchWeb3 = async () => {
      const res = await getWeb3();
      setWeb3( res );
    }
    fetchWeb3();
  }, [])

  useEffect(() => {
    if( !web3 ) return

    const fecthAccounts = async () => {
      const res = await web3.eth.getAccounts()
      setAccounts( res )
    }

    fecthAccounts();
  }, [web3])

  useEffect(() => {
    if( accounts.length === 0 || !web3) return 

    const fecthContract = async () => {
      
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract( instance )
    }

    fecthContract();
  }, [web3 ,accounts])

  useEffect(() => {
    if( !contract ) return
    const defValue = async () => {
      await contract.methods.set( 30 ).send( { from: accounts[0] } );
      const response = await contract.methods.get().call();
      setStorageValue( response );
    }

    defValue();
  }, [contract])

  const add = async ( num ) => {
    const result = storageValue + num;

    if( result < 0){
      return
    }

    await contract.methods.set( result ).send( { from: accounts[0] } );
    
    const response = await contract.methods.get().call();

    setStorageValue( parseInt( response ) )
  }

  if( !web3 || !contract ){
    return(
      <h1>
        Cargando...
      </h1>
    )
  }

  return(
    <div className="App">
      <button onClick={ () => add( 1 ) }>
          +1
      </button>
      <button onClick={ () => add( -1 )  }>
        -1
      </button>
      <div>
        Ether: { storageValue }
      </div>
      <div>
        Name: { 'hola' }
      </div>
    </div>
  )
}



/*class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };
  a = '';
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
      this.setState({ web3, accounts, storageValue: 0 ,contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

    this.a = await this.getName();

  };


  add = async ( num ) => {
    const { accounts, contract } = this.state;
    const result = this.state.storageValue + num
    if( result < 0){
      return
    }

    await contract.methods.set( result ).send( { from: accounts[0] } );
    
    const response = await contract.methods.get().call();

    this.setState( { storageValue:  parseInt(response) } )
  }

  getName = async ()=>{
    const { contract } = this.state;
    const result = await contract.methods.getName().call();
    return result;
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
        <div>
          Name: { this.a }
        </div>
      </div>
    );
  }
}*/

export default App;
